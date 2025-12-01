// src/app/login/page.tsx
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-800">
            Login Anggota
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Masuk ke portal IKA Al-Ikhlas
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
          
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}