"use client";
import { Sidebar } from "@/components/layout/sidebar";
export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="hidden lg:block lg:w-64" />
            <main className="flex-1 p-4 lg:p-8">
                {children}
            </main>
        </div>
    );
}
