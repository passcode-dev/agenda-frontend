"use client"

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function SidebarToggle({ isCollapsed, onToggle }) {
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={onToggle}
      className={`fixed top-4 z-50 text-white hover:bg-gray-800 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-68'
      }`}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}