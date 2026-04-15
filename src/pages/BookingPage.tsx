import { PageHeader } from '@/components/layout/PageHeader'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { BookingSettings } from '@/components/booking/BookingSettings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Settings } from 'lucide-react'

export default function BookingPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Booking"
        description="Gestion des rendez-vous"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Configuration
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <BookingCalendar />
          </TabsContent>
          <TabsContent value="settings">
            <div className="max-w-lg">
              <BookingSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
