import React, { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'

export default function Pesticides() {
  const [items, setItems] = useState<any[]>([])
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
    pesticide_name: '',
    type: '',
    brand: '',
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
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pesticides')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setItems(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      const { error } = await supabase
        .from('pesticides')
        .update(formData)
        .eq('id', editingId)
      
      if (!error) {
        setIsModalOpen(false)
        setEditingId(null)
        fetchItems()
        setFormData({
          pesticide_name: '', type: '', brand: '', supplier: '',
          date_received: '', expiration_date: '', qty_received: '',
          qty_available: '', unit: '', storage_location: '', remarks: ''
        })
      }
    } else {
      const { error } = await supabase
        .from('pesticides')
        .insert([formData])
      
      if (!error) {
        setIsModalOpen(false)
        fetchItems()
        setFormData({
          pesticide_name: '', type: '', brand: '', supplier: '',
          date_received: '', expiration_date: '', qty_received: '',
          qty_available: '', unit: '', storage_location: '', remarks: ''
        })
      }
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      pesticide_name: item.pesticide_name || '',
      type: item.type || '',
      brand: item.brand || '',
      supplier: item.supplier || '',
      date_received: item.date_received || '',
      expiration_date: item.expiration_date || '',
      qty_received: item.qty_received || '',
      qty_available: item.qty_available || '',
      unit: item.unit || '',
      storage_location: item.storage_location || '',
      remarks: item.remarks || ''
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      const { error } = await supabase
        .from('pesticides')
        .delete()
        .eq('id', deleteId)
      
      if (!error) {
        fetchItems()
      }
      setDeleteId(null)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({
      pesticide_name: '', type: '', brand: '', supplier: '',
      date_received: '', expiration_date: '', qty_received: '',
      qty_available: '', unit: '', storage_location: '', remarks: ''
    })
  }

  const filteredItems = items.filter(item => 
    item.pesticide_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pesticides Inventory</h1>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({
            pesticide_name: '', type: '', brand: '', supplier: '',
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
            <TableHead>Pesticide Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
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
          ) : filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-gray-500">No records found</TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.pesticide_name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.date_received}</TableCell>
                <TableCell>{item.expiration_date}</TableCell>
                <TableCell>{item.qty_received}</TableCell>
                <TableCell>{item.qty_available}</TableCell>
                <TableCell>{getStatusBadge(Number(item.qty_available))}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.storage_location}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteId(item.id)}
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
              <label className="text-sm font-medium text-gray-700">Pesticide Name</label>
              <Input required value={formData.pesticide_name} onChange={e => setFormData({...formData, pesticide_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="">Select...</option>
                <option value="Herbicide">Herbicide</option>
                <option value="Insecticide">Insecticide</option>
                <option value="Fungicide">Fungicide</option>
                <option value="Rodenticide">Rodenticide</option>
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
                <option value="bottles">bottles</option>
                <option value="liters">liters</option>
                <option value="kg">kg</option>
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
