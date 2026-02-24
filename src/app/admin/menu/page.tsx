 'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MenuManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('food');
  const [emoji, setEmoji] = useState('🍽️');

  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('menu_items').select('*').order('name');
    if (error) toast.error('Failed to load menu');
    else setItems(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name || !price) return toast.error('Name and Price required');
    
    const itemData = { name, price: parseFloat(price), category, emoji };

    if (editingItem) {
      // Update
      const { error } = await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
      if (error) toast.error('Update failed');
      else toast.success('Item updated!');
    } else {
      // Create
      const { error } = await supabase.from('menu_items').insert([itemData]);
      if (error) toast.error('Insert failed');
      else toast.success('Item added!');
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setName(''); setPrice(''); setCategory('food'); setEmoji('🍽️');
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) toast.error('Delete failed');
      else {
        toast.success('Deleted');
        fetchItems();
      }
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category);
    setEmoji(item.emoji);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white">
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-orange-400">Menu Manager</h1>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); setName(''); setPrice(''); }}
          className="bg-green-600 px-4 py-2 rounded font-bold text-sm"
        >
          + Add New Item
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-sm text-gray-400 uppercase">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                <td className="p-4 flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.name}</span>
                </td>
                <td className="p-4 text-gray-400 capitalize">{item.category}</td>
                <td className="p-4 text-orange-400 font-mono">KES {item.price.toLocaleString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditModal(item)} className="text-blue-400 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            
            <div className="space-y-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-gray-700 p-2 rounded" />
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (KES)" className="w-full bg-gray-700 p-2 rounded" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-700 p-2 rounded">
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
                <option value="desserts">Desserts</option>
              </select>
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji (e.g. 🍺)" className="w-full bg-gray-700 p-2 rounded" />
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-600 py-2 rounded font-bold">Cancel</button>
              <button onClick={handleSave} className="w-full bg-orange-500 py-2 rounded font-bold text-black">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}