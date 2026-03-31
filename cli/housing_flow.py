"""
Housing Scraper Flow — Tumai
Scrapes Idealista/Fotocasa via Apify → Filters by rules → Sends matches via WhatsApp

Usage:
    python3 tumai/cli/housing_flow.py

Config loaded from tumai/.env
"""

import asyncio
import os
import re
from pathlib import Path
from dataclasses import dataclass

# Load .env
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


# ═══════════════════════════════════════════════════════════════
# 1. DATA MODEL
# ═══════════════════════════════════════════════════════════════

@dataclass
class Listing:
    title: str = ""
    price: int = 0
    location: str = ""
    bedrooms: int = 0
    sqm: int = 0
    url: str = ""
    image_url: str = ""
    source: str = ""

    def summary(self) -> str:
        parts = [f"🏠 *{self.title}*"]
        if self.price:
            parts.append(f"💰 {self.price:,}€")
        if self.location:
            parts.append(f"📍 {self.location}")
        details = []
        if self.bedrooms:
            details.append(f"{self.bedrooms} hab")
        if self.sqm:
            details.append(f"{self.sqm} m²")
        if details:
            parts.append(f"📐 {' · '.join(details)}")
        if self.url:
            parts.append(f"🔗 {self.url}")
        return "\n".join(parts)


# ═══════════════════════════════════════════════════════════════
# 2. SCRAPERS (via Apify)
# ═══════════════════════════════════════════════════════════════

def scrape_idealista(location: str, max_price: int, min_sqm: int) -> list[Listing]:
    """Scrape Idealista via Apify actor."""
    from apify_client import ApifyClient

    token = os.environ["APIFY_API_TOKEN"]
    client = ApifyClient(token)

    search_url = f"https://www.idealista.com/venta-viviendas/{location.lower()}/"
    if max_price:
        search_url += f"con-precio-hasta_{max_price}/"

    print(f"  [idealista] Running Apify actor for: {search_url}")

    run_input = {
        "startUrls": [{"url": search_url}],
        "maxItems": 20,
        "proxy": {"useApifyProxy": True},
    }

    try:
        run = client.actor("igolaizola/idealista-scraper").call(run_input=run_input)
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        print(f"  [idealista] Apify returned {len(items)} items")
    except Exception as e:
        print(f"  [idealista] Apify error: {e}")
        # Try alternative actor
        try:
            print(f"  [idealista] Trying alternative actor...")
            run = client.actor("axlymxp/idealista-scraper").call(run_input={
                "searchUrl": search_url,
                "maxResults": 20,
            })
            items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
            print(f"  [idealista] Alternative returned {len(items)} items")
        except Exception as e2:
            print(f"  [idealista] Alternative also failed: {e2}")
            return []

    listings = []
    for item in items:
        listings.append(Listing(
            title=_get(item, "title", "address", "propertyType") or "Vivienda Idealista",
            price=_get_int(item, "price", "priceInfo.price.amount", "rawPrice"),
            location=_get(item, "address", "location", "neighborhood", "district") or location,
            bedrooms=_get_int(item, "rooms", "bedrooms", "propertyRooms"),
            sqm=_get_int(item, "size", "surface", "sqm", "area"),
            url=_get(item, "url", "link", "propertyUrl") or "",
            image_url=_get(item, "thumbnail", "mainImage", "image") or "",
            source="idealista",
        ))

    print(f"  [idealista] Parsed {len(listings)} listings")
    return listings


def scrape_fotocasa(location: str, max_price: int, min_sqm: int) -> list[Listing]:
    """Scrape Fotocasa via Apify actor."""
    from apify_client import ApifyClient

    token = os.environ["APIFY_API_TOKEN"]
    client = ApifyClient(token)

    search_url = f"https://www.fotocasa.es/es/comprar/viviendas/{location.lower()}/todas-las-zonas/l"

    print(f"  [fotocasa] Running Apify actor for: {search_url}")

    run_input = {
        "startUrls": [{"url": search_url}],
        "maxItems": 20,
        "proxy": {"useApifyProxy": True},
    }

    try:
        run = client.actor("igolaizola/fotocasa-scraper").call(run_input=run_input)
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        print(f"  [fotocasa] Apify returned {len(items)} items")
    except Exception as e:
        print(f"  [fotocasa] Apify error: {e}")
        # Try alternative actor
        try:
            print(f"  [fotocasa] Trying alternative actor...")
            run = client.actor("ralvaromariano/fotocasa").call(run_input={
                "searchUrl": search_url,
                "maxResults": 20,
            })
            items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
            print(f"  [fotocasa] Alternative returned {len(items)} items")
        except Exception as e2:
            print(f"  [fotocasa] Alternative also failed: {e2}")
            return []

    listings = []
    for item in items:
        listings.append(Listing(
            title=_get(item, "title", "address", "propertyType") or "Vivienda Fotocasa",
            price=_get_int(item, "price", "priceAmount", "rawPrice"),
            location=_get(item, "address", "location", "zone") or location,
            bedrooms=_get_int(item, "rooms", "bedrooms"),
            sqm=_get_int(item, "surface", "size", "sqm", "area"),
            url=_get(item, "url", "link", "detailUrl") or "",
            image_url=_get(item, "thumbnail", "mainImage", "image") or "",
            source="fotocasa",
        ))

    print(f"  [fotocasa] Parsed {len(listings)} listings")
    return listings


# ═══════════════════════════════════════════════════════════════
# 3. RULES ENGINE (filter)
# ═══════════════════════════════════════════════════════════════

@dataclass
class FilterRules:
    max_price: int = 0
    min_price: int = 0
    min_bedrooms: int = 0
    min_sqm: int = 0

def apply_rules(listings: list[Listing], rules: FilterRules) -> list[Listing]:
    """Filter listings by rules. Only apply rules that are set (> 0)."""
    filtered = []
    for l in listings:
        if rules.max_price and l.price > rules.max_price:
            continue
        if rules.min_price and l.price < rules.min_price and l.price > 0:
            continue
        if rules.min_bedrooms and l.bedrooms < rules.min_bedrooms and l.bedrooms > 0:
            continue
        if rules.min_sqm and l.sqm < rules.min_sqm and l.sqm > 0:
            continue
        filtered.append(l)
    return filtered


# ═══════════════════════════════════════════════════════════════
# 4. WHATSAPP SENDER
# ═══════════════════════════════════════════════════════════════

def send_whatsapp(phone: str, listings: list[Listing]):
    """Send filtered listings via WhatsApp using Twilio."""
    from twilio.rest import Client

    sid = os.environ["TWILIO_ACCOUNT_SID"]
    token = os.environ["TWILIO_AUTH_TOKEN"]
    from_number = os.environ["TWILIO_WHATSAPP_NUMBER"]

    client = Client(sid, token)

    if not listings:
        msg = client.messages.create(
            from_=from_number,
            to=f"whatsapp:{phone}",
            body="🔍 Housing Scraper: No new listings matched your filters this run.",
        )
        print(f"  [whatsapp] Sent 'no results' message: {msg.sid}")
        return

    # Send header
    header = f"🏠 *Housing Scraper — {len(listings)} listings found*\n"
    header += f"Filters: {config['min_price']:,}€–{config['max_price']:,}€"
    if config['min_bedrooms']:
        header += f", ≥{config['min_bedrooms']} bed"
    if config['min_sqm']:
        header += f", ≥{config['min_sqm']}m²"

    client.messages.create(
        from_=from_number,
        to=f"whatsapp:{phone}",
        body=header,
    )

    # Send each listing (max 10 to avoid spam)
    for listing in listings[:10]:
        try:
            client.messages.create(
                from_=from_number,
                to=f"whatsapp:{phone}",
                body=listing.summary(),
            )
        except Exception as e:
            print(f"  [whatsapp] Error sending listing: {e}")

    if len(listings) > 10:
        client.messages.create(
            from_=from_number,
            to=f"whatsapp:{phone}",
            body=f"... y {len(listings) - 10} más. Ajusta tus filtros para menos resultados.",
        )

    print(f"  [whatsapp] Sent {min(len(listings), 10)} listing messages to {phone}")


# ═══════════════════════════════════════════════════════════════
# 5. HELPERS
# ═══════════════════════════════════════════════════════════════

def _get(data: dict, *keys: str) -> str:
    """Get first non-empty string value from a dict, trying multiple keys.
    Supports dot notation for nested access (e.g., 'priceInfo.price.amount').
    """
    for key in keys:
        if "." in key:
            parts = key.split(".")
            val = data
            for part in parts:
                if isinstance(val, dict):
                    val = val.get(part)
                else:
                    val = None
                    break
            if val and str(val).strip():
                return str(val).strip()
        else:
            val = data.get(key)
            if val and str(val).strip():
                return str(val).strip()
    return ""


def _get_int(data: dict, *keys: str) -> int:
    """Get first numeric value from a dict, trying multiple keys."""
    for key in keys:
        val_str = _get(data, key)
        if val_str:
            # Remove non-numeric chars except digits
            cleaned = re.sub(r"[^\d]", "", val_str)
            if cleaned:
                num = int(cleaned)
                if num > 0:
                    return num
        # Also try direct int/float access
        if "." not in key:
            val = data.get(key)
            if isinstance(val, (int, float)) and val > 0:
                return int(val)
    return 0


# ═══════════════════════════════════════════════════════════════
# 6. MAIN FLOW
# ═══════════════════════════════════════════════════════════════

# Flow configuration (from the Tumai Flow Configurator)
config = {
    "sources": ["idealista", "fotocasa"],
    "location": "madrid",
    "max_price": 500000,
    "min_price": 200000,
    "min_bedrooms": 2,
    "min_sqm": 100,
    "phone": "+34697836561",
}


def run_flow():
    print("=" * 60)
    print("TUMAI — Housing Scraper Flow")
    print("=" * 60)
    print(f"  Location: {config['location']}")
    print(f"  Price: {config['min_price']:,}€ - {config['max_price']:,}€")
    print(f"  Min bedrooms: {config['min_bedrooms']}")
    print(f"  Min sqm: {config['min_sqm']}")
    print(f"  Sources: {', '.join(config['sources'])}")
    print(f"  WhatsApp: {config['phone']}")
    print()

    # Step 1: Scrape via Apify
    print("[Step 1/3] Scraping listings via Apify...")
    all_listings: list[Listing] = []

    if "idealista" in config["sources"]:
        idealista_listings = scrape_idealista(
            config["location"], config["max_price"], config["min_sqm"]
        )
        all_listings.extend(idealista_listings)

    if "fotocasa" in config["sources"]:
        fotocasa_listings = scrape_fotocasa(
            config["location"], config["max_price"], config["min_sqm"]
        )
        all_listings.extend(fotocasa_listings)

    print(f"\n  Total scraped: {len(all_listings)} listings\n")

    # Step 2: Filter
    print("[Step 2/3] Applying filters...")
    rules = FilterRules(
        max_price=config["max_price"],
        min_price=config["min_price"],
        min_bedrooms=config["min_bedrooms"],
        min_sqm=config["min_sqm"],
    )
    filtered = apply_rules(all_listings, rules)
    print(f"  Passed filters: {len(filtered)}/{len(all_listings)}\n")

    # Step 3: Send via WhatsApp
    print("[Step 3/3] Sending via WhatsApp...")
    send_whatsapp(config["phone"], filtered)

    print(f"\n{'=' * 60}")
    print("Flow complete!")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    run_flow()
