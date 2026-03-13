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
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    recipient: '',
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
    
    if (editingId) {
      const { error } = await supabase
        .from('distributions')
        .update(formData)
        .eq('id', editingId)
      
      if (!error) {
        setIsModalOpen(false)
        setEditingId(null)
        fetchItems()
        setFormData({
          recipient: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
        })
      }
    } else {
      const { error } = await supabase
        .from('distributions')
        .insert([formData])
      
      if (!error) {
        setIsModalOpen(false)
        fetchItems()
        setFormData({
          recipient: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
        })
      }
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      recipient: item.recipient || '',
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
      recipient: '', item_name: '', quantity: '', date: '', time: '', distributed_by: '', program: '', remarks: ''
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
            recipient: '', date: '', distributed_by: '', program: '', remarks: ''
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
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">Loading...</TableCell>
            </TableRow>
          ) : filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">No records found</TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.recipient}</TableCell>
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
              <label className="text-sm font-medium text-gray-700">Item Distributed</label>
              <Input required value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} placeholder="e.g. Fertilizer A" />
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
