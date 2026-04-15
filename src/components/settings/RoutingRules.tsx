import { useState } from 'react'
import { Plus, GitBranch, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoutingRuleEditor } from './RoutingRuleEditor'
import { useRoutingRules } from '@/hooks/useRoutingRules'

export function RoutingRules() {
  const [showEditor, setShowEditor] = useState(false)
  const { rules, isLoading, updateRule, deleteRule } = useRoutingRules()

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-brand-500" />
            Routing intelligent
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            Assignez automatiquement les leads à vos commerciaux selon des critères de qualification
          </p>
        </div>
        <Button size="sm" onClick={() => setShowEditor(true)}>
          <Plus className="w-3.5 h-3.5" />
          Nouvelle règle
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />)}
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-[var(--border-default)] rounded-xl">
          <GitBranch className="w-7 h-7 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">Aucune règle configurée</p>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            Créez des règles pour router automatiquement les leads vers les bons commerciaux
          </p>
          <Button size="sm" variant="outline" onClick={() => setShowEditor(true)}>
            <Plus className="w-3.5 h-3.5" /> Créer une règle
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{rule.name}</p>
                      <Badge variant={rule.is_active ? 'won' : 'secondary'} className="text-[10px] px-1.5">
                        {rule.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {rule.conditions.map((cond, j) => (
                        <p key={j} className="text-xs text-[var(--text-secondary)]">
                          SI <span className="font-medium">{cond.field}</span>{' '}
                          <span className="text-[var(--text-tertiary)]">{cond.operator}</span>{' '}
                          <span className="font-medium">"{cond.value}"</span>
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-brand-600 mt-1.5">
                      → Assigner à <span className="font-medium">{rule.assign_to_user_id}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => updateRule.mutate({ id: rule.id, is_active: !rule.is_active })}
                    >
                      {rule.is_active
                        ? <ToggleRight className="w-4 h-4 text-brand-500" />
                        : <ToggleLeft className="w-4 h-4 text-[var(--text-tertiary)]" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-[var(--text-tertiary)] hover:text-red-500"
                      onClick={() => deleteRule.mutate(rule.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <RoutingRuleEditor open={showEditor} onClose={() => setShowEditor(false)} />
    </div>
  )
}
