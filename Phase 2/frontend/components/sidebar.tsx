"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  User,
  Calculator,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  BarChart,
  Lightbulb,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { isOpen, toggle, isMobile } = useSidebar();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const routes = [
    {
      href: "/dashboard",
      icon: User,
      label: "Dashboard",
      color: "from-blue-500 to-indigo-500",
    },
    {
      href: "/process",
      icon: Calculator,
      label: "Problem Solver",
      color: "from-purple-500 to-pink-500",
    },
    {
      href: "/resources",
      icon: Lightbulb,
      label: "Resources",
      color: "from-amber-500 to-orange-500",
    },
    {
      href: "/quizzes",
      icon: BarChart,
      label: "Quizzes",
      color: "from-green-500 to-teal-500",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      color: "from-rose-500 to-red-500",
    },
  ];

  // Mobile header
  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 flex h-[var(--header-height)] items-center border-b bg-background px-4 shadow-sm">
          <Button variant="ghost" size="icon" onClick={toggle} className="mr-2">
            <Menu className="h-6 w-6 text-primary" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gradient">M-AI</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="touch-target"
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6 text-amber-400" />
            ) : (
              <Moon className="h-6 w-6 text-indigo-600" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="touch-target"
          >
            <LogOut className="h-6 w-6 text-destructive" />
            <span className="sr-only">Logout</span>
          </Button>
        </header>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={toggle}
            />
            <div className="fixed top-0 left-0 bottom-0 z-50 w-[var(--sidebar-width)] bg-background border-r animate-in slide-in-from-left duration-300 shadow-lg">
              <div className="flex h-[var(--header-height)] items-center border-b px-4 bg-gradient-to-r from-primary/10 to-accent/10">
                <h1 className="text-xl font-bold text-gradient">M-AI</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className="ml-auto"
                >
                  <ChevronLeft className="h-6 w-6 text-primary" />
                  <span className="sr-only">Close Menu</span>
                </Button>
              </div>
              <div className="flex flex-col gap-3 p-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => isMobile && toggle()}
                    className={cn(
                      "flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-all focus-ring",
                      pathname === route.href
                        ? `bg-gradient-to-r ${route.color} text-white shadow-md`
                        : "hover:bg-muted",
                      "touch-target"
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <main className="pt-[var(--header-height)]">
          <div className="container px-4 py-6">{children}</div>
        </main>
      </>
    );
  }

  // Desktop layout
  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 border-r bg-background transition-[width] duration-300 shadow-md",
          isOpen
            ? "w-[var(--sidebar-width)]"
            : "w-[var(--sidebar-width-collapsed)]"
        )}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          {isOpen && <h1 className="text-xl font-bold text-gradient">M-AI</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className={cn(
              "transition-transform text-primary",
              !isOpen && "mx-auto rotate-180"
            )}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <div className="flex flex-col gap-3 p-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-all focus-ring",
                pathname === route.href
                  ? `bg-gradient-to-r ${route.color} text-white shadow-md`
                  : "hover:bg-muted",
                !isOpen && "justify-center px-0"
              )}
            >
              <route.icon className={cn("h-5 w-5", !isOpen && "h-6 w-6")} />
              {isOpen && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t gap-2 flex items-center justify-center bg-gradient-to-r from-primary/5 to-accent/5">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="text-primary hover:text-accent"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={logout}
            className="touch-target"
          >
            <LogOut className="h-4 w-4 text-white" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </aside>

      <main
        className={cn(
          "flex-1 transition-[margin] duration-300",
          isOpen
            ? "ml-[var(--sidebar-width)]"
            : "ml-[var(--sidebar-width-collapsed)]"
        )}
      >
        <div className="container px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
