// src/app/admin/organization/add-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addOfficer } from "@/actions/organization"

type RegionSimple = {
  id: number;
  name: string;
}

export function AddOfficerForm({ regions }: { regions: RegionSimple[] }) {
  const [state, action, isPending] = useActionState(addOfficer, null)

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div className={`p-2 text-xs rounded ${state.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold">Wilayah</label>
        <select name="regionId" className="w-full border rounded h-9 px-2 text-sm" required>
          {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold">Nama Lengkap</label>
        <Input name="name" placeholder="Ahmad Fulan, S.Pd" required />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-bold">Jabatan</label>
          <Input name="position" placeholder="Ketua Umum" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold">Urutan (1=Top)</label>
          <Input name="order" type="number" defaultValue="10" />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "..." : "Tambah"}
      </Button>
    </form>
  )
}