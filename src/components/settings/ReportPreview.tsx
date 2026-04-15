import { BarChart3, TrendingUp, MessageSquare, Calendar } from 'lucide-react'
import { useOrgStore } from '@/stores/orgStore'

interface ReportPreviewProps {
  sections: string[]
}

export function ReportPreview({ sections }: ReportPreviewProps) {
  const { activeSubAccount } = useOrgStore()
  const name = activeSubAccount?.name || 'Votre Entreprise'

  return (
    <div className="border border-[var(--border-default)] rounded-xl overflow-hidden bg-white text-[#212529] text-[13px]">
      {/* Email header */}
      <div className="bg-[#5c7cfa] px-6 py-4 text-white">
        <p className="font-bold text-base">{name}</p>
        <p className="text-xs opacity-80 mt-0.5">Rapport de performance hebdomadaire</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Greeting */}
        <p className="text-gray-600 text-xs">Bonjour,</p>
        <p className="text-gray-700 text-xs">
          Voici votre rapport de performance de la semaine du <strong>7 au 14 avril 2026</strong>.
        </p>

        {/* KPIs */}
        {sections.includes('kpis') && (
          <div>
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#5c7cfa]" /> Métriques clés
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Conversations', value: '47' },
                { label: 'Leads qualifiés', value: '12' },
                { label: 'RDV pris', value: '8' },
                { label: 'Taux réponse', value: '68%' },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded p-2">
                  <p className="text-lg font-bold text-gray-800">{m.value}</p>
                  <p className="text-[10px] text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Funnel */}
        {sections.includes('funnel') && (
          <div>
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#40c057]" /> Entonnoir
            </p>
            <div className="space-y-1">
              {[
                { label: 'Contacts', pct: 100, color: '#748ffc' },
                { label: 'Qualifiés', pct: 26, color: '#fab005' },
                { label: 'RDV', pct: 17, color: '#40c057' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 w-16">{s.label}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="text-[10px] text-gray-600 w-8 text-right">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deals */}
        {sections.includes('deals') && (
          <div>
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#339af0]" /> Top deals cette semaine
            </p>
            <div className="space-y-1">
              {[
                { name: 'Sophie Martin', deal: 'Villa Prestige', value: '12 000 €' },
                { name: 'Marc Dubois', deal: 'Appartement T4', value: '8 500 €' },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-700">{d.name} — <span className="text-gray-500">{d.deal}</span></span>
                  <span className="font-semibold text-[#40c057]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            Rapport généré automatiquement par AI Closer · {name}
          </p>
        </div>
      </div>
    </div>
  )
}
