'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Zap, LayoutDashboard, Store, Play, GitBranch, Plug, Settings,
  LogOut, ChevronDown,
} from 'lucide-react';
import { initStore, getUser, getWorkspace, logout } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/executions', label: 'Executions', icon: Play },
  { href: '/editor', label: 'Flow Editor', icon: GitBranch },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/workspace', label: 'Workspace', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    initStore();
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="h-screen w-screen bg-[#161618] flex items-center justify-center">
        <Zap size={32} className="text-indigo-500 animate-pulse" />
      </div>
    );
  }

  const user = getUser()!;
  const workspace = getWorkspace();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-[220px] h-full bg-[#1a1a1d] border-r border-[#2e2e33] flex flex-col">
        {/* Logo */}
        <Link href="/dashboard" className="px-5 py-4 flex items-center gap-3 hover:bg-[#222225] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold text-white tracking-tight">Tumai</h1>
            <p className="text-[10px] text-[#6b6b70]">{workspace?.name ?? 'Platform'}</p>
          </div>
        </Link>

        <div className="mx-4 h-px bg-[#2e2e33]" />

        {/* Nav Links */}
        <div className="flex-1 px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-white font-medium'
                    : 'text-[#a0a0a5] hover:bg-[#222225] hover:text-white'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-[#6b6b70]'} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Visual Canvas link */}
        <div className="px-3 pb-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[12px] text-[#6b6b70] hover:bg-[#222225] hover:text-[#a0a0a5] transition-colors border border-[#2e2e33] border-dashed"
          >
            <GitBranch size={14} />
            Visual Canvas
          </Link>
        </div>

        {/* User menu */}
        <div className="border-t border-[#2e2e33] p-3 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#222225] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-[11px] font-semibold text-indigo-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[12px] text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#6b6b70] truncate">{user.email}</p>
            </div>
            <ChevronDown size={12} className="text-[#6b6b70]" />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#222225] border border-[#2e2e33] rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#a0a0a5] hover:bg-[#2a2a2e] hover:text-white transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-[#161618]">
        {children}
      </main>
    </div>
  );
}
