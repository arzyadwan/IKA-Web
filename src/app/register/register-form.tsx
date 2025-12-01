// src/app/register/register-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/actions/auth"

// Definisikan tipe props untuk data wilayah
type Region = {
  id: number;
  name: string;
  slug: string;
}

export function RegisterForm({ regions }: { regions: Region[] }) {
  // Hook ini menghubungkan form dengan server action dan state error
  const [state, action, isPending] = useActionState(registerUser, null)

  return (
    <form action={action} className="space-y-4">
      {/* Tampilkan Pesan Error Global jika ada */}
      {state?.message && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}

      {/* Nama Lengkap */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Nama Lengkap</label>
        <Input name="fullName" placeholder="Sesuai Ijazah" required />
        {state?.errors?.fullName && (
          <p className="text-xs text-red-500">{state.errors.fullName[0]}</p>
        )}
      </div>

      {/* Email & Password */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input name="email" type="email" placeholder="nama@email.com" required />
          {state?.errors?.email && (
            <p className="text-xs text-red-500">{state.errors.email[0]}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input name="password" type="password" required />
          {state?.errors?.password && (
            <p className="text-xs text-red-500">{state.errors.password[0]}</p>
          )}
        </div>
      </div>

      {/* No WA & Angkatan */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">WhatsApp</label>
          <Input name="phoneNumber" type="tel" placeholder="0812..." required />
          {state?.errors?.phoneNumber && (
            <p className="text-xs text-red-500">{state.errors.phoneNumber[0]}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Angkatan (Tahun)</label>
          <Input name="graduationYear" type="number" placeholder="2015" required />
          {state?.errors?.graduationYear && (
            <p className="text-xs text-red-500">{state.errors.graduationYear[0]}</p>
          )}
        </div>
      </div>

      {/* Pilihan Wilayah (Region) */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Domisili Saat Ini</label>
        <select 
          name="regionSlug" 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          required
          defaultValue=""
        >
          <option value="" disabled>Pilih Wilayah IKA...</option>
          {regions.map((region) => (
            <option key={region.id} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
        {state?.errors?.regionSlug && (
          <p className="text-xs text-red-500">{state.errors.regionSlug[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isPending}>
        {isPending ? "Mendaftarkan..." : "Daftar Sekarang"}
      </Button>
    </form>
  )
}