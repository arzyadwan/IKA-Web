import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { MobileMenu } from "./mobile-menu"; // <--- Import ini
import { Menu } from "lucide-react"; // Pastikan install lucide-react

export async function Navbar() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Logo Icon Placeholder - Ganti dengan Image jika ada */}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-all group-hover:rotate-3">
            A
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight group-hover:text-primary transition-colors">
            IKA Al-Ikhlas
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {[
            ["Beranda", "/"],
            ["Kabar", "/berita"],
            ["Agenda", "/agenda"],
            ["Galeri", "/galeri"],
            ["Cari Alumni", "/search"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="relative hover:text-primary transition-colors after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hover:text-primary hover:bg-primary/5">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Daftar Anggota
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <MobileMenu isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </nav>
  );
}
