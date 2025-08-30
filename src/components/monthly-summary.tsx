'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ExpensePieChart from './expense-pie-chart'

interface MonthlyData {
  totalIncome: number
  totalExpense: number
  netBalance: number
  transactionCount: number
}

interface MonthlySummaryProps {
  refreshTrigger?: number
}

export default function MonthlySummary({ refreshTrigger }: MonthlySummaryProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchMonthlySummary = async () => {
    setIsLoading(true)
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('transactions')
        .select('kind, amount')
        .gte('occurred_at', startOfMonth.toISOString().split('T')[0])
        .lte('occurred_at', endOfMonth.toISOString().split('T')[0])

      if (error) {
        console.error('Error fetching monthly summary:', error)
        return
      }

      const income = data
        .filter(t => t.kind === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      const expense = data
        .filter(t => t.kind === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      setMonthlyData({
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        transactionCount: data.length
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonthlySummary()
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Monthly Summary</h2>
        <div className="text-center py-4 text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Summary Cards */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Monthly Overview</h2>
            <p className="text-slate-500 text-lg">{getCurrentMonth()}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-semibold text-green-600 mb-2">Income</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(monthlyData.totalIncome)}
              </div>
            </div>

            {/* Total Expense */}
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
              <div className="text-2xl mb-2">💸</div>
              <div className="text-sm font-semibold text-red-600 mb-2">Expenses</div>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(monthlyData.totalExpense)}
              </div>
            </div>

            {/* Net Balance */}
            <div className={`text-center p-6 rounded-2xl border ${
              monthlyData.netBalance >= 0 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <div className="text-2xl mb-2">{monthlyData.netBalance >= 0 ? '📈' : '📉'}</div>
              <div className={`text-sm font-semibold mb-2 ${
                monthlyData.netBalance >= 0
                  ? 'text-blue-600'
                  : 'text-orange-600'
              }`}>
                Net Balance
              </div>
              <div className={`text-2xl font-bold ${
                monthlyData.netBalance >= 0
                  ? 'text-blue-700'
                  : 'text-orange-700'
              }`}>
                {formatCurrency(monthlyData.netBalance)}
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <span className="text-sm text-slate-600">
                📊 {monthlyData.transactionCount} transaction{monthlyData.transactionCount !== 1 ? 's' : ''} this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="lg:col-span-1">
        <ExpensePieChart refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}