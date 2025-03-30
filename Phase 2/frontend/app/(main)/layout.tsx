import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"

export default function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar>{children}</Sidebar>
    </div>
  )
}

