'use client'

import { useState } from 'react'
import { supabase, type NewTransaction } from '@/lib/supabase'

interface TransactionFormProps {
  onTransactionAdded: () => void
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    kind: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    note: '',
    occurred_at: new Date().toISOString().split('T')[0] // Today's date
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const transaction: NewTransaction = {
        kind: formData.kind,
        amount: parseFloat(formData.amount),
        category: formData.category || null,
        note: formData.note || null,
        occurred_at: formData.occurred_at
      }

      const { error } = await supabase
        .from('transactions')
        .insert([transaction])

      if (error) {
        console.error('Error adding transaction:', error)
        alert('Failed to add transaction')
      } else {
        // Reset form
        setFormData({
          kind: 'expense',
          amount: '',
          category: '',
          note: '',
          occurred_at: new Date().toISOString().split('T')[0]
        })
        onTransactionAdded()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 relative z-10">
      <h2 className="text-xl font-bold mb-6 text-slate-900 text-center">Add New Transaction</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, kind: 'expense' })}
            className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] ${
              formData.kind === 'expense'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, kind: 'income' })}
            className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] ${
              formData.kind === 'income'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💰 Income
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700">
            💵 Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-xl font-bold">฿</span>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full pl-10 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 text-xl font-semibold transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
              🏷️ Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 transition-all"
              placeholder="Food, Transport, etc."
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-semibold text-slate-700">
              📅 Date
            </label>
            <input
              type="date"
              id="date"
              required
              value={formData.occurred_at}
              onChange={(e) => setFormData({ ...formData, occurred_at: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label htmlFor="note" className="block text-sm font-semibold text-slate-700">
            📝 Note (optional)
          </label>
          <input
            type="text"
            id="note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 transition-all"
            placeholder="Additional details..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.amount}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-blue-500/25"
        >
          {isSubmitting ? '⏳ Adding...' : '✨ Add Transaction'}
        </button>
      </form>
    </div>
  )
}