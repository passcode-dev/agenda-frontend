"use client";

import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
