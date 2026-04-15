import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SequenceStep } from './SequenceStep'
import type { CampaignSequence } from '@/types/database'

type LocalStep = Partial<CampaignSequence> & { _localId: string }

interface SequenceEditorProps {
  initial?: CampaignSequence[]
  onChange: (steps: LocalStep[]) => void
}

function newStep(index: number): LocalStep {
  return {
    _localId: `step-${Date.now()}-${index}`,
    name: `Étape ${index + 1}`,
    template_a: '',
    delay_hours: index === 0 ? 0 : 24,
    send_if_no_reply: true,
    stop_if_replied: true,
    stop_if_booked: true,
  }
}

export function SequenceEditor({ initial = [], onChange }: SequenceEditorProps) {
  const [steps, setSteps] = useState<LocalStep[]>(
    initial.length > 0
      ? initial.map((s) => ({ ...s, _localId: s.id || `step-${s.step_number}` }))
      : [newStep(0)]
  )

  const update = (updated: LocalStep[]) => {
    setSteps(updated)
    onChange(updated)
  }

  const addStep = () => update([...steps, newStep(steps.length)])

  const updateStep = (localId: string, changes: Partial<CampaignSequence>) => {
    update(steps.map((s) => (s._localId === localId ? { ...s, ...changes } : s)))
  }

  const deleteStep = (localId: string) => {
    if (steps.length <= 1) return
    update(steps.filter((s) => s._localId !== localId))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...steps]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    update(next)
  }

  const moveDown = (index: number) => {
    if (index === steps.length - 1) return
    const next = [...steps]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    update(next)
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <SequenceStep
          key={step._localId}
          step={step}
          index={i}
          total={steps.length}
          onChange={(changes) => updateStep(step._localId, changes)}
          onDelete={() => deleteStep(step._localId)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
        />
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={addStep}>
        <Plus className="w-3.5 h-3.5 mr-2" />
        Ajouter une étape
      </Button>
    </div>
  )
}
