import {
  Mail, Bell, AlertTriangle, Globe, Monitor, ScanSearch,
  Calculator, TrendingUp, Camera, Mic, MessageSquare, MessageCircle,
  FileText, FolderUp, LineChart, Shield, PieChart,
  Clock, RefreshCw, BrainCircuit, ClipboardCheck,
  GitCompareArrows, ArrowLeftRight, BarChart3, FileSpreadsheet,
  BadgeDollarSign, TimerOff, GitBranch, CalendarDays,
  ShieldAlert, Scale, Workflow, HandCoins, SearchCheck,
  FileSignature, Hammer, Play, Settings, Plug,
  type LucideIcon,
} from 'lucide-react';

export type { LucideIcon } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Mail, Bell, AlertTriangle, Globe, Monitor, ScanSearch,
  Calculator, TrendingUp, Camera, Mic, MessageSquare, MessageCircle,
  FileText, FolderUp, LineChart, Shield, PieChart,
  Clock, RefreshCw, BrainCircuit, ClipboardCheck,
  GitCompareArrows, ArrowLeftRight, BarChart3, FileSpreadsheet,
  BadgeDollarSign, TimerOff, GitBranch, CalendarDays,
  ShieldAlert, Scale, Workflow, HandCoins, SearchCheck,
  FileSignature, Hammer, Play, Settings, Plug,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Globe;
}
