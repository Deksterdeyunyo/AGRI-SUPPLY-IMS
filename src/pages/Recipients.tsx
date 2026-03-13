import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'

export default function Recipients() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    barangay: '',
    municipality: '',
    contact_number: '',
    farm_size: '',
    farmer_group: '',
    date_registered: '',
    remarks: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setItems(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('recipients')
      .insert([formData])
    
    if (!error) {
      setIsModalOpen(false)
      fetchItems()
      setFormData({
        full_name: '', gender: '', barangay: '', municipality: '',
        contact_number: '', farm_size: '', farmer_group: '',
        date_registered: '', remarks: ''
      })
    }
  }

  const filteredItems = items.filter(item => 
    item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.barangay?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Recipients / Beneficiaries</h1>
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
            <TableHead>Full Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Municipality</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Farm Size</TableHead>
            <TableHead>Farmer Group</TableHead>
            <TableHead>Date Registered</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">Loading...</TableCell>
            </TableRow>
          ) : filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">No records found</TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.full_name}</TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>{item.barangay}</TableCell>
                <TableCell>{item.municipality}</TableCell>
                <TableCell>{item.contact_number}</TableCell>
                <TableCell>{item.farm_size}</TableCell>
                <TableCell>{item.farmer_group}</TableCell>
                <TableCell>{item.date_registered}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Barangay</label>
              <Input value={formData.barangay} onChange={e => setFormData({...formData, barangay: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Municipality</label>
              <Input value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <Input value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Farm Size (ha)</label>
              <Input type="number" step="0.01" value={formData.farm_size} onChange={e => setFormData({...formData, farm_size: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Farmer Group</label>
              <Input value={formData.farmer_group} onChange={e => setFormData({...formData, farmer_group: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Registered</label>
              <Input type="date" value={formData.date_registered} onChange={e => setFormData({...formData, date_registered: e.target.value})} />
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
