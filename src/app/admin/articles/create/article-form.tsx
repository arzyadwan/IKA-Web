// src/app/admin/articles/create/article-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createArticle } from "@/actions/article"

// Tipe data sederhana untuk region
type RegionSimple = { id: number; name: string }

export function ArticleForm({ regions }: { regions: RegionSimple[] }) {
  const [state, action, isPending] = useActionState(createArticle, null)

  return (
    <form action={action} className="space-y-6">
      {state?.message && (
        <div className={`p-3 text-sm rounded ${state.message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="font-bold text-sm">Judul Artikel</label>
        <Input name="title" placeholder="Contoh: Profil Alumni Sukses - Budi Hartono" required />
        {state?.errors?.title && <p className="text-xs text-red-500">{state.errors.title[0]}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-bold text-sm">Wilayah Penerbit</label>
          <select name="regionId" className="flex h-10 w-full rounded-md border px-3 text-sm bg-white" required defaultValue="">
            <option value="" disabled>Pilih Wilayah...</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="font-bold text-sm">Gambar Utama (URL)</label>
          <Input name="imageUrl" placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Isi Artikel</label>
        <textarea 
          name="content" 
          className="w-full min-h-[300px] rounded-md border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed" 
          placeholder="Tulis artikel lengkap di sini..."
          required 
        />
        {state?.errors?.content && <p className="text-xs text-red-500">{state.errors.content[0]}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Menerbitkan..." : "Terbitkan Artikel"}
      </Button>
    </form>
  )
}