'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/actions/profile"
import { Briefcase, Activity, FileText, MapPin, Save } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

type ProfileData = {
  profession?: string | null;
  bloodType?: string | null;
  santriId?: string | null;
  address?: string | null;
}

export function EditProfileForm({ existingData }: { existingData: ProfileData }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  // Efek Toast saat sukses/gagal
  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message)
    } else if (state?.status === 'error') {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-8">
      
      {/* Bagian 1: Profesional & Medis */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Data Pribadi
        </h3>
        
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Pekerjaan / Profesi
            </label>
            <Input 
              name="profession" 
              defaultValue={existingData.profession || ''} 
              placeholder="Contoh: Dokter, Guru, Software Engineer" 
              className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" /> Golongan Darah
            </label>
            <div className="relative">
              <select 
                name="bloodType" 
                defaultValue={existingData.bloodType || ''} 
                className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              >
                <option value="">- Pilih Golongan Darah -</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              {/* Panah custom untuk select */}
              <div className="absolute right-3 top-3.5 pointer-events-none opacity-50">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Akademik */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Data Akademik
        </h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Nomor Stambuk / Santri ID</label>
          <Input 
            name="santriId" 
            defaultValue={existingData.santriId || ''} 
            placeholder="Nomor yang tertera di ijazah (Opsional)" 
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all font-mono"
          />
          <p className="text-[11px] text-slate-400">Kosongkan jika Anda lupa.</p>
        </div>
      </div>

      {/* Bagian 3: Alamat */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Domisili Saat Ini
        </h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
          <textarea 
            name="address" 
            defaultValue={existingData.address || ''}
            className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan..."
          />
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          {isPending ? (
            "Menyimpan Perubahan..." 
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Simpan Profil
            </>
          )}
        </Button>
      </div>
    </form>
  )
}