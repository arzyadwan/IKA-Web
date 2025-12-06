// src/app/admin/gallery/create/gallery-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createAlbum } from "@/actions/gallery"
import { supabase } from "@/lib/supabase-client"

// 1. Definisikan Tipe Data Region
type RegionSimple = {
  id: number;
  name: string;
}

// 2. Gunakan tipe 'RegionSimple[]' di props
export function CreateGalleryForm({ regions }: { regions: RegionSimple[] }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return
    
    setUploading(true)
    const files = Array.from(e.target.files)
    const urls: string[] = []

    try {
      let count = 0
      for (const file of files) {
        count++
        setProgress(`Mengupload foto ke-${count} dari ${files.length}...`)
        
        // Sanitize file name
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '-')
        const filePath = `gallery/${Date.now()}-${cleanName}`
        
        const { error } = await supabase.storage.from('uploads').upload(filePath, file)
        
        if (!error) {
          const { data } = supabase.storage.from('uploads').getPublicUrl(filePath)
          urls.push(data.publicUrl)
        }
      }
      setUploadedUrls(urls)
    } catch (err) {
      alert('Gagal upload sebagian foto.')
    } finally {
      setUploading(false)
      setProgress("")
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Kita susun payload manual agar sesuai dengan tipe di Server Action
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      eventDate: formData.get('eventDate'),
      regionId: parseInt(formData.get('regionId') as string),
      imageUrls: uploadedUrls
    }

    startTransition(async () => {
      await createAlbum(null, payload)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="font-bold text-sm">Judul Album</label>
        <Input name="title" placeholder="Reuni Akbar Angkatan 2010" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-bold text-sm">Tanggal Kegiatan</label>
          <Input name="eventDate" type="date" required />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-sm">Wilayah</label>
          <select name="regionId" className="w-full border rounded h-10 px-3 bg-white" required defaultValue="">
             <option value="" disabled>Pilih Wilayah...</option>
             {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Upload Foto (Bisa banyak sekaligus)</label>
        <Input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFiles}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-blue-600 animate-pulse">{progress}</p>}
        
        {uploadedUrls.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-2">
            {uploadedUrls.map((url, idx) => (
              <img key={idx} src={url} alt="preview" className="w-full h-16 object-cover rounded border" />
            ))}
            <div className="flex items-center justify-center bg-green-50 text-green-700 text-xs font-bold rounded border">
              {uploadedUrls.length} Foto Siap
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Deskripsi Singkat (Opsional)</label>
        <Input name="description" placeholder="Keterangan tambahan..." />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || uploading || uploadedUrls.length === 0}>
        {isPending ? "Menyimpan Album..." : "Terbitkan Album"}
      </Button>
    </form>
  )
}