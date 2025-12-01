// src/app/dashboard/profile/edit-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/actions/profile"

// 1. Definisikan tipe data sesuai skema database Prisma
type ProfileData = {
  profession?: string | null;
  bloodType?: string | null;
  santriId?: string | null;
  address?: string | null;
}

// 2. Gunakan tipe tersebut di sini (menggantikan 'any')
export function EditProfileForm({ existingData }: { existingData: ProfileData }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  return (
    <form action={action} className="space-y-4">
      
      {state?.message && (
        <div className={`p-3 text-sm rounded-md ${state.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Pekerjaan / Profesi</label>
          {/* Note: Kita pakai || '' agar jika data null, React tidak error */}
          <Input name="profession" defaultValue={existingData.profession || ''} placeholder="Contoh: Dokter, Guru, Programmer" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Golongan Darah</label>
          <select 
            name="bloodType" 
            defaultValue={existingData.bloodType || ''} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">- Pilih -</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Nomor Stambuk / Santri ID</label>
        <Input name="santriId" defaultValue={existingData.santriId || ''} placeholder="Opsional jika lupa" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Alamat Lengkap (Domisili)</label>
        <textarea 
          name="address" 
          defaultValue={existingData.address || ''}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Jalan, Nomor rumah, Kelurahan..."
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}