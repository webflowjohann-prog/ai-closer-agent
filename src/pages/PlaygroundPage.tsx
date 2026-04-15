import { PageHeader } from '@/components/layout/PageHeader'
import { PlaygroundChat } from '@/components/playground/PlaygroundChat'
import { PlaygroundControls } from '@/components/playground/PlaygroundControls'
import { usePlayground } from '@/hooks/usePlayground'

export default function PlaygroundPage() {
  const { messages, loading, vertical, setVertical, apiKey, setApiKey, sendMessage, reset } = usePlayground()

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Playground"
        description="Testez votre agent IA avant de l'activer"
      />

      <div className="flex-1 flex overflow-hidden p-6 gap-4">
        {/* Controls */}
        <div className="w-64 flex-shrink-0">
          <PlaygroundControls
            vertical={vertical}
            onVerticalChange={setVertical}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onReset={reset}
          />
        </div>

        {/* Chat */}
        <div className="flex-1 min-w-0">
          <PlaygroundChat
            messages={messages}
            loading={loading}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  )
}
