interface VariableInserterProps {
  onInsert: (variable: string) => void
  variant?: 'brand' | 'purple'
}

const VARIABLES = [
  { key: '{{first_name}}', label: 'Prénom' },
  { key: '{{last_name}}', label: 'Nom' },
  { key: '{{company_name}}', label: 'Entreprise' },
  { key: '{{personal_context}}', label: 'Contexte' },
  { key: '{{agent_name}}', label: 'Agent' },
]

export function VariableInserter({ onInsert, variant = 'brand' }: VariableInserterProps) {
  const cls = variant === 'brand'
    ? 'bg-brand-50 text-brand-600 hover:bg-brand-100'
    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-[10px] text-[var(--text-tertiary)] mr-1">Variables :</span>
      {VARIABLES.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onInsert(key)}
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${cls}`}
          title={key}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
