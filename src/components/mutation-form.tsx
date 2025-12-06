'use client'

import { useActionState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { requestMutation } from "@/actions/mutation"
import { toast } from "sonner"

type Region = { id: number; name: string }

export function MutationForm({ regions }: { regions: Region[] }) {
  const [state, action, isPending] = useActionState(requestMutation, null)

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('Berhasil')) toast.success(state.message)
      else toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-5">
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Tujuan Perpindahan</label>
        <select 
          name="targetRegionId" 
          className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          required
          defaultValue=""
        >
          <option value="" disabled>Pilih Wilayah...</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>{region.name}</option>
          ))}
        </select>
        {state?.errors?.targetRegionId && <p className="text-xs text-red-500">{state.errors.targetRegionId[0]}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Alasan Pindah</label>
        <textarea 
          name="reason" 
          className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Contoh: Pindah tugas kerja, Lanjut studi S2..."
          required
        />
        {state?.errors?.reason && <p className="text-xs text-red-500">{state.errors.reason[0]}</p>}
      </div>

      <Button type="submit" className="w-full h-11 shadow-md hover:shadow-lg" disabled={isPending}>
        {isPending ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
      </Button>
    </form>
  )
}