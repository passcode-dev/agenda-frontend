"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar({ image }) {
  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={image} alt="User avatar" />
    </Avatar>
  )
}