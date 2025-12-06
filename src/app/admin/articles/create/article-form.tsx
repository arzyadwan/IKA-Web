// src/app/admin/articles/create/article-form.tsx
'use client'

import { useActionState, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createArticle } from "@/actions/article"
import { supabase } from "@/lib/supabase-client"

type RegionSimple = { id: number; name: string }

export function ArticleForm({ regions }: { regions: RegionSimple[] }) {
  const [state, action, isPending] = useActionState(createArticle, null)
  
  // State untuk menangani upload
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("") 

  // Fungsi Upload ke Supabase
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `articles/${fileName}`

    setUploading(true)

    try {
      // 1. Upload File
      const { error: uploadError } = await supabase.storage
        .from('uploads') // Nama bucket yg tadi dibuat
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Ambil URL Publik
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      setImageUrl(data.publicUrl) // Simpan URL ke state untuk dikirim ke DB
    } catch (error) {
      alert('Gagal upload gambar!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

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
        
        {/* INPUT FILE UPLOAD */}
        <div className="space-y-1">
          <label className="font-bold text-sm">Gambar Utama</label>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            disabled={uploading}
          />
          {uploading && <p className="text-xs text-blue-500">Sedang mengupload...</p>}
          
          {/* Trik: Input tersembunyi untuk mengirim URL ke Server Action */}
          <input type="hidden" name="imageUrl" value={imageUrl} />
          
          {/* Preview Gambar */}
          {imageUrl && (
            <div className="mt-2 w-32 h-20 bg-slate-100 rounded overflow-hidden border">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
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
      </div>

      <Button type="submit" className="w-full" disabled={isPending || uploading}>
        {isPending ? "Menerbitkan..." : "Terbitkan Artikel"}
      </Button>
    </form>
  )
}