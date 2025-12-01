// src/components/mutation-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Kita pakai Textarea sebenarnya nanti
import { requestMutation } from "@/actions/mutation"

type Region = {
  id: number;
  name: string;
}

export function MutationForm({ regions }: { regions: Region[] }) {
  const [state, action, isPending] = useActionState(requestMutation, null)

  return (
    <form action={action} className="space-y-4 border p-4 rounded-lg bg-white">
      <h3 className="font-semibold text-lg">Formulir Pindah Domisili</h3>
      
      {state?.message && (
        <div className={`p-3 text-sm rounded-md border ${
          state.message.includes('Berhasil') 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-500 border-red-200'
        }`}>
          {state.message}
        </div>
      )}

      {/* Pilih Wilayah Tujuan */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Pindah ke Wilayah Mana?</label>
        <select 
          name="targetRegionId" 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
          defaultValue=""
        >
          <option value="" disabled>Pilih Tujuan...</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        {state?.errors?.targetRegionId && (
          <p className="text-xs text-red-500">{state.errors.targetRegionId[0]}</p>
        )}
      </div>

      {/* Alasan / Alamat Baru */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Alamat Baru / Alasan Pindah</label>
        <textarea 
          name="reason" 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Contoh: Pindah kerja, alamat kos baru di Jl. Kaliurang Km 5..."
          required
        />
        {state?.errors?.reason && (
          <p className="text-xs text-red-500">{state.errors.reason[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mengirim Pengajuan..." : "Ajukan Perpindahan"}
      </Button>
    </form>
  )
}