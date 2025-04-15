
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Image, Package, Library, Settings, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center p-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-400">
            Instalora
          </span>
        )}
        {collapsed && <div className="w-8 h-8 rounded-full bg-primary mx-auto" />}
        <button
          onClick={toggleSidebar}
          className="ml-auto text-sidebar-foreground hover:text-primary transition-colors p-1 rounded-md"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-6 overflow-y-auto">
        <ul className="space-y-1 px-2">
          <NavItem icon={<LayoutDashboard size={20} />} to="/" label="Dashboard" collapsed={collapsed} />
          <NavItem icon={<Users size={20} />} to="/models" label="Models" collapsed={collapsed} />
          <NavItem icon={<Image size={20} />} to="/generator" label="Generator" collapsed={collapsed} />
          <NavItem icon={<Library size={20} />} to="/library" label="Content Library" collapsed={collapsed} />
          <NavItem icon={<Package size={20} />} to="/packages" label="Packages" collapsed={collapsed} />
          <NavItem icon={<BarChart3 size={20} />} to="/analytics" label="Analytics" collapsed={collapsed} />
          <NavItem icon={<Settings size={20} />} to="/settings" label="Settings" collapsed={collapsed} />
        </ul>
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-instalora-purple flex items-center justify-center text-white font-medium">
            P
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <div className="text-sm font-medium truncate">Partner Brand</div>
              <div className="text-xs text-sidebar-foreground/70 truncate">partner@example.com</div>
            </div>
          )}
          {!collapsed && (
            <button className="ml-auto text-sidebar-foreground hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
};

const NavItem = ({ icon, label, to, collapsed }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center px-3 py-2 rounded-md transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            collapsed ? "justify-center" : ""
          )
        }
      >
        <span className="flex items-center justify-center">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </NavLink>
    </li>
  );
};
