"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  const menus = [
    { label: 'Beranda', href: '/' },
    { label: 'Kabar', href: '/berita' },
    { label: 'Agenda', href: '/agenda' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Cari Alumni', href: '/search' },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left border-b pb-4 mb-4">
          <SheetTitle className="font-bold text-xl text-primary flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm">A</div>
            IKA Al-Ikhlas
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          {menus.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setOpen(false)} // Tutup menu saat diklik
              className="text-lg font-medium text-slate-600 hover:text-primary transition-colors px-2 py-1 hover:bg-slate-50 rounded-md"
            >
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-slate-100 my-2"></div>

          {isLoggedIn ? (
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button className="w-full bg-primary font-bold">Buka Dashboard</Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Masuk</Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full bg-accent text-white hover:bg-accent/90">Daftar Anggota</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}