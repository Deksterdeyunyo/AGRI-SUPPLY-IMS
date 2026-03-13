import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Printer, Download } from 'lucide-react'

export default function Reports() {
  const [lowStockSeeds, setLowStockSeeds] = useState<any[]>([])
  const [recentDistributions, setRecentDistributions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'low-stock' | 'distributions'>('low-stock')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    
    // Fetch low stock seeds (assuming qty_available < 10)
    const { data: seedsData } = await supabase
      .from('seeds')
      .select('*')
      .lt('qty_available', 10)
      .order('qty_available', { ascending: true })
      .limit(5)
    
    if (seedsData) setLowStockSeeds(seedsData)

    // Fetch recent distributions
    const { data: distData } = await supabase
      .from('distributions')
      .select('*')
      .order('date', { ascending: false })
      .limit(5)
    
    if (distData) setRecentDistributions(distData)

    setLoading(false)
  }

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,"
    
    if (activeTab === 'low-stock') {
      csvContent += "Low Stock Seeds\n"
      csvContent += "Seed Name,Variety,Available,Unit\n"
      lowStockSeeds.forEach(seed => {
        csvContent += `"${seed.seed_name}","${seed.variety}","${seed.qty_available}","${seed.unit}"\n`
      })
    } else {
      csvContent += "Recent Distributions\n"
      csvContent += "Recipient,Item,Quantity,Date,Time,Program,Distributed By\n"
      recentDistributions.forEach(dist => {
        csvContent += `"${dist.recipient}","${dist.item_name}","${dist.quantity}","${dist.date}","${dist.time}","${dist.program}","${dist.distributed_by}"\n`
      })
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${activeTab}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8 print:space-y-6">
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {activeTab === 'low-stock' ? 'Low Stock Report' : 'Recent Distributions Report'}
        </h1>
        <p className="text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 print:hidden">
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'low-stock'
              ? 'border-[#004d40] text-[#004d40]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('low-stock')}
        >
          Low Stock Items
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'distributions'
              ? 'border-[#004d40] text-[#004d40]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('distributions')}
        >
          Recent Distributions
        </button>
      </div>

      {activeTab === 'low-stock' && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 print:shadow-none print:border-none print:p-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 print:hidden">Low Stock Seeds (below 10)</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seed Name</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">Loading...</TableCell>
                </TableRow>
              ) : lowStockSeeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">No low stock items</TableCell>
                </TableRow>
              ) : (
                lowStockSeeds.map((seed) => (
                  <TableRow key={seed.id}>
                    <TableCell className="font-medium">{seed.seed_name}</TableCell>
                    <TableCell>{seed.variety}</TableCell>
                    <TableCell className="text-red-600 font-semibold">{seed.qty_available}</TableCell>
                    <TableCell>{seed.unit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'distributions' && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 print:shadow-none print:border-none print:p-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 print:hidden">Recent Distributions</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Distributed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">Loading...</TableCell>
                </TableRow>
              ) : recentDistributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">No records</TableCell>
                </TableRow>
              ) : (
                recentDistributions.map((dist) => (
                  <TableRow key={dist.id}>
                    <TableCell className="font-medium">{dist.recipient}</TableCell>
                    <TableCell>{dist.item_name}</TableCell>
                    <TableCell>{dist.quantity}</TableCell>
                    <TableCell>{dist.date}</TableCell>
                    <TableCell>{dist.time}</TableCell>
                    <TableCell>{dist.program}</TableCell>
                    <TableCell>{dist.distributed_by}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
