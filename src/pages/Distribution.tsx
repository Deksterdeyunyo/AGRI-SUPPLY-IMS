import React, { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'

export default function Distribution() {
  const [items, setItems] = useState<any[]>([])
  const [recipients, setRecipients] = useState<any[]>([])
  const [availableItems, setAvailableItems] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    recipient: '',
    category: '',
    item_name: '',
    quantity: '',
    date: '',
    time: '',
    distributed_by: '',
    program: '',
    remarks: ''
  })

  useEffect(() => {
    fetchItems()
    fetchRecipients()
  }, [])

  useEffect(() => {
    if (formData.category) {
      fetchAvailableItems(formData.category)
    } else {
      setAvailableItems([])
    }
  }, [formData.category])

  const fetchAvailableItems = async (category: string) => {
    let tableName = ''
    let nameColumn = ''
    
    switch (category) {
      case 'Seeds':
        tableName = 'seeds'
        nameColumn = 'seed_name'
        break
      case 'Fertilizers':
        tableName = 'fertilizers'
        nameColumn = 'fertilizer_name'
        break
      case 'Vet & Chemicals':
        tableName = 'vet_chemicals'
        nameColumn = 'product_name'
        break
      case 'Pesticides':
        tableName = 'pesticides'
        nameColumn = 'pesticide_name'
        break
      default:
        return
    }

    const { data } = await supabase.from(tableName).select(nameColumn)
    if (data) {
      setAvailableItems(data.map(item => item[nameColumn]))
    }
  }

  const fetchRecipients = async () => {
    const { data } = await supabase
      .from('recipients')
      .select('full_name')
      .order('full_name')
    if (data) setRecipients(data)
  }

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('distributions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setItems(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload: any = { ...formData }
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        payload[key] = null
      }
    })
    
    if (editingId) {
      const { error } = await supabase
        .from('distributions')
        .update(payload)
        .eq('id', editingId)
      
      if (!error) {
        setIsModalOpen(false)
        setEditingId(null)
        fetchItems()
        setFormData({
          recipient: '', category: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
        })
      } else {
        console.error("Error updating:", error)
        alert("Failed to update record. Please check your inputs.")
      }
    } else {
      const { error } = await supabase
        .from('distributions')
        .insert([payload])
      
      if (!error) {
        setIsModalOpen(false)
        fetchItems()
        setFormData({
          recipient: '', category: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
        })
      } else {
        console.error("Error inserting:", error)
        if (!(import.meta as any).env.VITE_SUPABASE_URL) {
          alert("Database connection missing! Please add your Supabase URL and Anon Key in the Settings menu.")
        } else {
          alert("Failed to add record. Please check your inputs.")
        }
      }
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      recipient: item.recipient || '',
      category: item.category || '',
      item_name: item.item_name || '',
      quantity: item.quantity || '',
      date: item.date || '',
      time: item.time || '',
      distributed_by: item.distributed_by || '',
      program: item.program || '',
      remarks: item.remarks || ''
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      const { error } = await supabase
        .from('distributions')
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
      recipient: '', category: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
    })
  }

  const filteredItems = items.filter(item => 
    item.recipient?.toLowerCase().includes(search.toLowerCase()) ||
    item.program?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Distribution Records</h1>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({
            recipient: '', category: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
          })
          setIsModalOpen(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Distribution
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
            <TableHead>Recipient</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Distributed By</TableHead>
            <TableHead>Program</TableHead>
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
                <TableCell>{item.recipient}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.distributed_by}</TableCell>
                <TableCell>{item.program}</TableCell>
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Edit Distribution" : "New Distribution"}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recipient</label>
              <Input 
                list="recipients-list"
                required 
                value={formData.recipient} 
                onChange={e => setFormData({...formData, recipient: e.target.value})} 
                placeholder="Type to search recipients..."
              />
              <datalist id="recipients-list">
                {recipients.map((r, i) => (
                  <option key={i} value={r.full_name} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004d40] focus:border-transparent"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value, item_name: ''})}
              >
                <option value="">Select Category</option>
                <option value="Seeds">Seeds</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Vet & Chemicals">Vet & Chemicals</option>
                <option value="Pesticides">Pesticides</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Item Distributed</label>
              <Input 
                list="items-list"
                required 
                value={formData.item_name} 
                onChange={e => setFormData({...formData, item_name: e.target.value})} 
                placeholder={formData.category ? "Type to search items..." : "Select a category first"}
                disabled={!formData.category}
              />
              <datalist id="items-list">
                {availableItems.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <Input type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time</label>
              <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Distributed By</label>
              <Input required value={formData.distributed_by} onChange={e => setFormData({...formData, distributed_by: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Program</label>
              <Input value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Remarks</label>
              <Input value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingId ? "Update" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Are you sure you want to delete this record? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
