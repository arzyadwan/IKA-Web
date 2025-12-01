// src/app/organisasi/page.tsx
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function OrganizationPublicPage() {
  // Ambil data wilayah + pengurusnya
  const regions = await prisma.region.findMany({
    include: {
      // Ambil OrgMember, urutkan berdasarkan 'order' (1, 2, 3...)
      orgMembers: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Struktur Organisasi</h1>
          <p className="text-slate-500">Susunan pengurus IKA Al-Ikhlas di berbagai wilayah.</p>
        </div>

        {/* Looping per Wilayah */}
        <div className="grid md:grid-cols-2 gap-8">
          {regions.map((region) => (
            <Card key={region.id} className="h-fit">
              <CardHeader className="bg-slate-900 text-white rounded-t-lg py-4">
                <CardTitle className="text-center text-lg">{region.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {region.orgMembers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 italic text-sm">
                    Data kepengurusan belum diinput.
                  </div>
                ) : (
                  <ul className="divide-y">
                    {region.orgMembers.map((member) => (
                      <li key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-800">{member.name}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">
                            {member.position}
                          </p>
                        </div>
                        {/* Jika nanti ada foto, taruh disini */}
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                          {member.name.charAt(0)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}