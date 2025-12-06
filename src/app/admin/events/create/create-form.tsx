// src/app/admin/events/create/create-form.tsx
'use client'

import { useActionState, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createEvent } from "@/actions/event"
import { supabase } from "@/lib/supabase-client"

type RegionSimple = { id: number; name: string }

export function CreateEventForm({ regions }: { regions: RegionSimple[] }) {
  const [state, action, isPending] = useActionState(createEvent, null)
  
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return
    const file = event.target.files[0]
    const filePath = `events/${Date.now()}-${file.name}`
    setUploading(true)

    try {
      const { error } = await supabase.storage.from('uploads').upload(filePath, file)
      if (error) throw error
      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath)
      setImageUrl(data.publicUrl)
    } catch (error) {
      alert('Gagal upload gambar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={action} className="space-y-6">
      {state?.message && <div className="text-red-500 text-sm">{state.message}</div>}

      <div className="space-y-1">
        <label className="font-bold text-sm">Nama Kegiatan</label>
        <Input name="title" placeholder="Webinar / Buka Bersama" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-bold text-sm">Waktu Pelaksanaan</label>
          <Input name="eventDate" type="datetime-local" required />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-sm">Lokasi</label>
          <Input name="location" placeholder="Zoom / Hotel X" required />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Gambar Banner</label>
        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
        {uploading && <p className="text-xs text-blue-500">Mengupload...</p>}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {imageUrl && <img src={imageUrl} alt="Preview" className="h-20 mt-2 rounded border" />}
      </div>

      <div className="space-y-2 border p-4 rounded bg-slate-50">
        <label className="font-bold text-sm block mb-2">Penyelenggara (Bisa pilih &gt; 1)</label>
        <div className="grid grid-cols-2 gap-2">
          {regions.map((region) => (
            <label key={region.id} className="flex items-center space-x-2 text-sm cursor-pointer">
              <input type="checkbox" name="regionIds" value={region.id} className="w-4 h-4" />
              <span>{region.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Deskripsi Lengkap</label>
        <textarea name="description" className="w-full border rounded p-2 h-32" required />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || uploading}>
        {isPending ? "Simpan..." : "Terbitkan Agenda"}
      </Button>
    </form>
  )
}