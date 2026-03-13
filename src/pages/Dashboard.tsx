import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Sprout, FlaskConical, Syringe, Bug, Users, Truck } from 'lucide-react'

export default function Dashboard() {
  const [counts, setCounts] = useState({
    seeds: 0,
    fertilizers: 0,
    vet_chemicals: 0,
    pesticides: 0,
    recipients: 0,
    distributions: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      const tables = ['seeds', 'fertilizers', 'vet_chemicals', 'pesticides', 'recipients', 'distributions']
      const newCounts = { ...counts }

      for (const table of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (count !== null) {
          newCounts[table as keyof typeof newCounts] = count
        }
      }
      setCounts(newCounts)
    }

    fetchCounts()
  }, [])

  const cards = [
    { name: 'Seeds', count: counts.seeds, icon: Sprout, color: 'text-green-600' },
    { name: 'Fertilizers', count: counts.fertilizers, icon: FlaskConical, color: 'text-blue-600' },
    { name: 'Vet & Chemicals', count: counts.vet_chemicals, icon: Syringe, color: 'text-purple-600' },
    { name: 'Pesticides', count: counts.pesticides, icon: Bug, color: 'text-red-600' },
    { name: 'Recipients', count: counts.recipients, icon: Users, color: 'text-orange-600' },
    { name: 'Distributions', count: counts.distributions, icon: Truck, color: 'text-teal-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.name} className="overflow-hidden rounded-lg bg-white shadow border border-gray-100">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="truncate text-sm font-medium text-gray-500">{card.name}</div>
                <card.icon className={`h-5 w-5 ${card.color}`} aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-baseline text-3xl font-semibold text-gray-900">
                {card.count}
              </div>
              <div className="mt-1 text-sm text-gray-500">Total records</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
