"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/contractors",
    label: "Contractors",
    icon: Users,
  },
  {
    href: "/stock",
    label: "Stock Prediction",
    icon: Boxes,
  },
  {
    href: "/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: Bell,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex h-16 items-center gap-2.5 px-3">
          <Logo className="text-primary" />
          <span className="font-headline text-2xl font-semibold text-foreground">
            CivilSage
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
