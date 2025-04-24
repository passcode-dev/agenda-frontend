"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarTeacher } from "@/components/layout/sidebarTeacher";
import { Suspense } from "react";

export default function TeacherLayout({ children }) {
  return (
    <Suspense>
      <div className="flex min-h-screen">
        <SidebarTeacher />
        <main className="w-full">{children}</main>
      </div>
    </Suspense>
  );
}
