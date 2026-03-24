import { AppSidebar } from "@/components/sections/dashboard/sidebar/AppSidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0">
                <SidebarTrigger className="lg:hidden absolute top-4 left-4 z-50 bg-background border shadow-md" />
                <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-12 min-w-0 ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
