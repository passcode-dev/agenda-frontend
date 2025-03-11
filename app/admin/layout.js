"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Suspense } from "react";

export default function AdminLayout({ children }) {
  return (
    <Suspense>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </Suspense>
  );
}
