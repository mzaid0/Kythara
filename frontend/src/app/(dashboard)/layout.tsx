"use client";
import { useState } from "react";
import { AdminSidebar } from "./_components/AdminSidebar";

export default function SuperAdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (
        <div className="flex h-screen w-screen">

            <AdminSidebar onExpandChange={setIsSidebarExpanded} />

            <div
                className="flex-1 overflow-auto transition-all duration-200 ease-out"
                style={{
                    marginLeft: isSidebarExpanded ? "0" : "0", 
                    width: isSidebarExpanded ? "calc(100% - 15rem)" : "calc(100% - 3.05rem)",
                }}
            >
                <div className="px-10 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

