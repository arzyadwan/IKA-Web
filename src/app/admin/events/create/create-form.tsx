// src/app/admin/events/create/create-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createEvent } from "@/actions/event"

// 1. Definisikan tipe data Region (Bentuk datanya apa?)
type RegionSimple = {
  id: number;
  name: string;
}

// 2. Gunakan 'RegionSimple[]' menggantikan 'any[]'
export function CreateEventForm({ regions }: { regions: RegionSimple[] }) {
  const [state, action, isPending] = useActionState(createEvent, null)

  return (
    <form action={action} className="space-y-6">
      {state?.message && (
        <div className={`text-sm p-3 rounded ${state.message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-red-100 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="font-bold text-sm">Nama Kegiatan</label>
        <Input name="title" placeholder="Webinar / Buka Bersama" required />
        {state?.errors?.title && <p className="text-xs text-red-500">{state.errors.title[0]}</p>}
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
        <label className="font-bold text-sm">Gambar Banner (URL)</label>
        <Input name="imageUrl" placeholder="https://..." />
      </div>

      {/* MULTI SELECT REGION */}
      <div className="space-y-2 border p-4 rounded bg-slate-50">
        <label className="font-bold text-sm block mb-2">Penyelenggara (Bisa pilih &gt; 1)</label>
        <div className="grid grid-cols-2 gap-2">
          {regions.map((region) => (
            <label key={region.id} className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                name="regionIds" 
                value={region.id} 
                className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{region.name}</span>
            </label>
          ))}
        </div>
        {state?.errors?.regionIds && <p className="text-xs text-red-500">{state.errors.regionIds[0]}</p>}
      </div>

      <div className="space-y-1">
        <label className="font-bold text-sm">Deskripsi Lengkap</label>
        <textarea 
          name="description" 
          className="w-full border rounded p-2 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" 
          required 
        />
        {state?.errors?.description && <p className="text-xs text-red-500">{state.errors.description[0]}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Simpan..." : "Terbitkan Agenda"}
      </Button>
    </form>
  )
}