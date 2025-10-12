"use client";

import * as React from "react";
import {
  AudioWaveform,
  Award,
  BookOpen,
  Bot,
  BowArrow,
  Coffee,
  Command,
  Focus,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  MessageSquare,
  MoveUpRight,
  PieChart,
  Settings2,
  SquareTerminal,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";

import { NavMain1 } from "@/components/shared/main/sidebar/nav-main1";
import { NavMain } from "@/components/shared/main/sidebar/nav-main";
import { NavUser } from "@/components/shared/main/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/shared/main/sidebar/team-switcher";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      name: "Trang chủ",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      name: "Phổ biến",
      url: "/popular",
      icon: MoveUpRight,
      isActive: true,
    },
    {
      name: "Bạn bè",
      url: "/friends",
      icon: UsersRound,
      isActive: true,
    },
    {
      name: "Trò chuyện",
      url: "/talks",
      icon: MessageSquare,
      isActive: true,
    },
    {
      name: "Mục tiêu",
      url: "/targets",
      icon: BowArrow,
      isActive: true,
    },
  ],

  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  navMain1: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain1 items={data.navMain1} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
