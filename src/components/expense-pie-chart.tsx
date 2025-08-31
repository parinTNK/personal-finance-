'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { supabase } from '@/lib/supabase'

interface CategoryData {
  name: string
  value: number
  color: string
}

interface ExpensePieChartProps {
  refreshTrigger?: number
}

// Predefined colors for categories
const COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#64748b', // slate-500
  '#78716c', // stone-500
]

export default function ExpensePieChart({ refreshTrigger }: ExpensePieChartProps) {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalExpenses, setTotalExpenses] = useState(0)

  const fetchExpensesByCategory = async () => {
    setIsLoading(true)
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      
      // Format dates properly to ensure all times are included
      const startDate = startOfMonth.toISOString().split('T')[0]
      const endDate = endOfMonth.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('kind', 'expense')
        .gte('occurred_at', startDate)
        .lte('occurred_at', endDate)

      if (error) {
        console.error('Error fetching expense data:', error)
        return
      }

      // Group by category
      const categoryMap = new Map<string, number>()
      let total = 0

      data.forEach(transaction => {
        const category = transaction.category || 'Uncategorized'
        const amount = Number(transaction.amount)
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount)
        total += amount
      })

      // Convert to chart data with colors
      const chartData = Array.from(categoryMap.entries())
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value) // Sort by value descending

      setCategoryData(chartData)
      setTotalExpenses(total)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpensesByCategory()
  }, [refreshTrigger])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1)
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Expense Categories</h3>
        <div className="text-center py-8 text-gray-500">Loading chart...</div>
      </div>
    )
  }

  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Expense Categories</h3>
        <div className="text-center py-8 text-gray-500">
          No expense data for {getCurrentMonth()}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
        <p className="text-sm text-gray-500">{getCurrentMonth()}</p>
        <p className="text-sm font-medium text-gray-700 mt-1">
          Total: {formatCurrency(totalExpenses)}
        </p>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend payload={categoryData.map(item => ({ value: item.name, color: item.color }))} />
    </div>
  )
}