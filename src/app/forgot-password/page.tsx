// src/app/forgot-password/page.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requestReset } from "@/actions/reset-password"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(requestReset, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
          <p className="text-center text-sm text-slate-500">
            Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mengatur ulang kata sandi Anda.
          </p>
        </CardHeader>
        <CardContent>
          {state?.status === 'success' ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
                ✅ Link reset telah dikirim! (Cek Terminal VS Code Anda)
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">Kembali ke Login</Button>
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              {state?.message && (
                <div className="p-3 bg-slate-100 text-slate-700 text-sm rounded">
                  {state.message}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="font-medium text-sm">Email</label>
                <Input name="email" type="email" placeholder="nama@email.com" required />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Mengirim..." : "Kirim Link Reset"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}