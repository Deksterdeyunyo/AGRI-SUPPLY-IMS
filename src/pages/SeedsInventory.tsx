import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'

export default function SeedsInventory() {
  const [seeds, setSeeds] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    seed_name: '',
    variety: '',
    category: '',
    supplier: '',
    date_received: '',
    expiration_date: '',
    qty_received: '',
    qty_available: '',
    unit: '',
    storage_location: '',
    remarks: ''
  })

  useEffect(() => {
    fetchSeeds()
  }, [])

  const fetchSeeds = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('seeds')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setSeeds(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('seeds')
      .insert([formData])
    
    if (!error) {
      setIsModalOpen(false)
      fetchSeeds()
      setFormData({
        seed_name: '', variety: '', category: '', supplier: '',
        date_received: '', expiration_date: '', qty_received: '',
        qty_available: '', unit: '', storage_location: '', remarks: ''
      })
    }
  }

  const filteredSeeds = seeds.filter(seed => 
    seed.seed_name?.toLowerCase().includes(search.toLowerCase()) ||
    seed.variety?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Seeds Inventory</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seed Name</TableHead>
            <TableHead>Variety</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date Received</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Qty Received</TableHead>
            <TableHead>Qty Available</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Storage Location</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-gray-500">Loading...</TableCell>
            </TableRow>
          ) : filteredSeeds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-gray-500">No records found</TableCell>
            </TableRow>
          ) : (
            filteredSeeds.map((seed) => (
              <TableRow key={seed.id}>
                <TableCell>{seed.seed_name}</TableCell>
                <TableCell>{seed.variety}</TableCell>
                <TableCell>{seed.category}</TableCell>
                <TableCell>{seed.supplier}</TableCell>
                <TableCell>{seed.date_received}</TableCell>
                <TableCell>{seed.expiration_date}</TableCell>
                <TableCell>{seed.qty_received}</TableCell>
                <TableCell>{seed.qty_available}</TableCell>
                <TableCell>{seed.unit}</TableCell>
                <TableCell>{seed.storage_location}</TableCell>
                <TableCell>{seed.remarks}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Record">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Seed Name</label>
              <Input required value={formData.seed_name} onChange={e => setFormData({...formData, seed_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Variety</label>
              <Input value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select...</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
                <option value="Grain">Grain</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Supplier</label>
              <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Received</label>
              <Input type="date" value={formData.date_received} onChange={e => setFormData({...formData, date_received: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Expiration Date</label>
              <Input type="date" value={formData.expiration_date} onChange={e => setFormData({...formData, expiration_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Qty Received</label>
              <Input type="number" value={formData.qty_received} onChange={e => setFormData({...formData, qty_received: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Qty Available</label>
              <Input type="number" value={formData.qty_available} onChange={e => setFormData({...formData, qty_available: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <Select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                <option value="">Select...</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="packs">packs</option>
                <option value="sacks">sacks</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Storage Location</label>
              <Input value={formData.storage_location} onChange={e => setFormData({...formData, storage_location: e.target.value})} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Remarks</label>
              <Input value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
