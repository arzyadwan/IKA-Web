// src/app/admin/activities/create/create-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createActivity } from "@/actions/activity"

// Tipe data untuk props
type Region = {
  id: number;
  name: string;
}

export function CreateActivityForm({ regions }: { regions: Region[] }) {
  // Hook ini menangani prevState dan formData secara otomatis
  const [state, action, isPending] = useActionState(createActivity, null)

  return (
    <form action={action} className="space-y-6">
      
      {/* Tampilkan pesan error global/sukses */}
      {state?.message && (
        <div className={`p-3 text-sm rounded-md border ${
          state.message.includes('Gagal') || state.message.includes('Akses') || state.message.includes('valid')
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="font-medium">Judul Kegiatan</label>
        <Input name="title" placeholder="Contoh: Halal bi Halal IKA Jakarta 2025" required />
        {state?.errors?.title && (
          <p className="text-xs text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-medium">Wilayah</label>
          <select 
            name="regionId" 
            className="flex h-10 w-full rounded-md border px-3 bg-white" 
            required
            defaultValue=""
          >
            <option value="" disabled>Pilih Wilayah...</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {state?.errors?.regionId && (
            <p className="text-xs text-red-500">{state.errors.regionId[0]}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label className="font-medium">URL Gambar (Opsional)</label>
          <Input name="imageUrl" placeholder="https://..." />
          <p className="text-xs text-slate-500">Copy link gambar dari Google Drive/Imgur</p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-medium">Isi Berita</label>
        <textarea 
          name="content" 
          className="w-full min-h-[200px] rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" 
          placeholder="Tulis detail kegiatan di sini..."
          required 
        />
        {state?.errors?.content && (
          <p className="text-xs text-red-500">{state.errors.content[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Menerbitkan..." : "Terbitkan Berita"}
      </Button>
    </form>
  )
}