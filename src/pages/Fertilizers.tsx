import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'

export default function Fertilizers() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    fertilizer_name: '',
    type: '',
    brand: '',
    supplier: '',
    date_received: '',
    qty_received: '',
    qty_available: '',
    unit: '',
    storage_location: '',
    remarks: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('fertilizers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setItems(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('fertilizers')
      .insert([formData])
    
    if (!error) {
      setIsModalOpen(false)
      fetchItems()
      setFormData({
        fertilizer_name: '', type: '', brand: '', supplier: '',
        date_received: '', qty_received: '', qty_available: '',
        unit: '', storage_location: '', remarks: ''
      })
    }
  }

  const filteredItems = items.filter(item => 
    item.fertilizer_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Fertilizers Inventory</h1>
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
            <TableHead>Fertilizer Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date Received</TableHead>
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
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">Loading...</TableCell>
            </TableRow>
          ) : filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">No records found</TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fertilizer_name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.date_received}</TableCell>
                <TableCell>{item.qty_received}</TableCell>
                <TableCell>{item.qty_available}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.storage_location}</TableCell>
                <TableCell>{item.remarks}</TableCell>
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
              <label className="text-sm font-medium text-gray-700">Fertilizer Name</label>
              <Input required value={formData.fertilizer_name} onChange={e => setFormData({...formData, fertilizer_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="">Select...</option>
                <option value="Organic">Organic</option>
                <option value="Inorganic">Inorganic</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <Input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
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
                <option value="bags">bags</option>
                <option value="sacks">sacks</option>
                <option value="liters">liters</option>
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
