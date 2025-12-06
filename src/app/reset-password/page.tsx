// src/app/reset-password/page.tsx
'use client'

import { useActionState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { performReset } from "@/actions/reset-password"
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Loader2 } from "lucide-react"

// 1. PISAHKAN LOGIKA FORM KE KOMPONEN SENDIRI
function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [state, action, isPending] = useActionState(performReset, null)

  // Validasi jika token tidak ada
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center text-red-600 font-medium">
            Error: Token reset password tidak ditemukan atau URL tidak valid.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Buat Password Baru</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.status === 'success' ? (
             <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                ✅ Password berhasil diubah.
              </div>
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90">Login Sekarang</Button>
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-5">
              {state?.message && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
                  {state.message}
                </div>
              )}

              {/* Token dikirim secara tersembunyi */}
              <input type="hidden" name="token" value={token} />

              <div className="space-y-1">
                <label className="font-bold text-sm text-slate-700">Password Baru</label>
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Minimal 6 karakter" 
                  required 
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-bold shadow-sm" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// 2. EXPORT DEFAULT HANYA SEBAGAI WRAPPER (BUNGKUSAN)
export default function ResetPasswordPage() {
  return (
    // Suspense wajib ada untuk membungkus komponen yang pakai useSearchParams
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}