import React, { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getStatusBadge = (qty: number) => {
    if (qty <= 0) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
    }
    if (qty < 10) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
  }

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
    
    if (editingId) {
      const { error } = await supabase
        .from('seeds')
        .update(formData)
        .eq('id', editingId)
      
      if (!error) {
        setIsModalOpen(false)
        setEditingId(null)
        fetchSeeds()
        setFormData({
          seed_name: '', variety: '', category: '', supplier: '',
          date_received: '', expiration_date: '', qty_received: '',
          qty_available: '', unit: '', storage_location: '', remarks: ''
        })
      }
    } else {
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
  }

  const handleEdit = (seed: any) => {
    setFormData({
      seed_name: seed.seed_name || '',
      variety: seed.variety || '',
      category: seed.category || '',
      supplier: seed.supplier || '',
      date_received: seed.date_received || '',
      expiration_date: seed.expiration_date || '',
      qty_received: seed.qty_received || '',
      qty_available: seed.qty_available || '',
      unit: seed.unit || '',
      storage_location: seed.storage_location || '',
      remarks: seed.remarks || ''
    })
    setEditingId(seed.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase
        .from('seeds')
        .delete()
        .eq('id', id)
      
      if (!error) {
        fetchSeeds()
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({
      seed_name: '', variety: '', category: '', supplier: '',
      date_received: '', expiration_date: '', qty_received: '',
      qty_available: '', unit: '', storage_location: '', remarks: ''
    })
  }

  const filteredSeeds = seeds.filter(seed => 
    seed.seed_name?.toLowerCase().includes(search.toLowerCase()) ||
    seed.variety?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Seeds Inventory</h1>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({
            seed_name: '', variety: '', category: '', supplier: '',
            date_received: '', expiration_date: '', qty_received: '',
            qty_available: '', unit: '', storage_location: '', remarks: ''
          })
          setIsModalOpen(true)
        }}>
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
            <TableHead>Status</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Storage Location</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-gray-500">Loading...</TableCell>
            </TableRow>
          ) : filteredSeeds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-gray-500">No records found</TableCell>
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
                <TableCell>{getStatusBadge(Number(seed.qty_available))}</TableCell>
                <TableCell>{seed.unit}</TableCell>
                <TableCell>{seed.storage_location}</TableCell>
                <TableCell>{seed.remarks}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(seed)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(seed.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Edit Record" : "Add New Record"}>
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
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingId ? "Update" : "Add"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
