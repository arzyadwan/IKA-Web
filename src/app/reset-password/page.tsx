// src/app/reset-password/page.tsx
'use client'

import { useActionState } from 'react' // Next 15
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { performReset } from "@/actions/reset-password"
import { useSearchParams } from 'next/navigation' // Untuk baca ?token=...
import Link from "next/link"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [state, action, isPending] = useActionState(performReset, null)

  if (!token) {
    return <div className="text-center p-10">Error: Token tidak ditemukan.</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Password Baru</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.status === 'success' ? (
             <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
                ✅ Password berhasil diubah.
              </div>
              <Link href="/login">
                <Button className="w-full">Login dengan Password Baru</Button>
              </Link>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              {state?.message && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded">
                  {state.message}
                </div>
              )}

              {/* Token dikirim sembunyi-sembunyi */}
              <input type="hidden" name="token" value={token} />

              <div className="space-y-1">
                <label className="font-medium text-sm">Password Baru</label>
                <Input name="password" type="password" placeholder="Minimal 6 karakter" required />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}