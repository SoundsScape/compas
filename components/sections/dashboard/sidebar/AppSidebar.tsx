"use client"

import * as React from "react"
import Image from 'next/image';
import {
    LayoutDashboard,
    FileText,
    School,
    Tags,
    Users,
    Settings,
    Globe,
    BadgeCheck,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import Link from "next/link"
import { useEffect } from "react";

const data = {
    navItems: [
        {
            title: "Artículos",
            url: "/dashboard/articles",
            icon: FileText,
            roles: ["teacher", "superadmin", "admin"]
        },
        {
            title: "Mis Artículos",
            url: "/dashboard/articles/my-articles",
            icon: FileText,
            roles: ["student", "teacher"]
        },
        {
            title: "Revisión",
            url: "/dashboard/articles/review",
            icon: BadgeCheck,
            roles: ["teacher", "admin", "superadmin"]
        },
        {
            title: "Escuelas",
            url: "/dashboard/schools",
            icon: School,
            roles: ["admin", "superadmin"]
        },
        {
            title: "Etiquetas",
            url: "/dashboard/tags",
            icon: Tags,
            roles: ["admin", "superadmin"]
        },
        {
            title: "Usuarios",
            url: "/dashboard/users",
            icon: Users,
            roles: ["admin", "superadmin"]
        },
    ],
    system: [
        {
            title: "Volver al Globo",
            url: "/home",
            icon: Globe,
            roles: ["student", "teacher", "admin", "superadmin"]
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<any>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Error parsing user from localStorage", e)
            }
        }
    }, [])

    const role = user?.role || "student" // Default to student if not found

    const filteredNavMain = data.navItems.filter(item => item.roles.includes(role))
    const filteredSystem = data.system.filter(item => item.roles.includes(role))

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu className="border-b border-border">
                    <SidebarMenuItem>
                        <SidebarMenuButton className=" h-fit rounded-none py-6 hover:bg-transparent" asChild>
                            <Link href="/home" className="w-full flex flex-col justify-center items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="White Logo"
                                    width={46}
                                    height={46}
                                    className="w-16 drop-shadow-[0px_0px_10px_rgba(0,0,0,0.9)] transition-all duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {filteredNavMain.length > 0 && (
                    <NavMain label="Gestión" items={filteredNavMain} />
                )}
                {filteredSystem.length > 0 && (
                    <NavMain label="Sistema" items={filteredSystem} />
                )}
            </SidebarContent>
            <SidebarFooter className="border-t border-border p-0">
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
