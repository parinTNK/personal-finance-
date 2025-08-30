'use client'

import { useState } from 'react'
import { supabase, type Transaction } from '@/lib/supabase'

export default function DataExport() {
  const [isExporting, setIsExporting] = useState(false)

  const fetchAllTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('occurred_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`)
    }

    return data || []
  }

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const exportAsCSV = async () => {
    try {
      setIsExporting(true)
      const transactions = await fetchAllTransactions()

      if (transactions.length === 0) {
        alert('No transactions to export')
        return
      }

      const headers = ['Date', 'Type', 'Amount', 'Category', 'Note', 'Created At']
      const csvContent = [
        headers.join(','),
        ...transactions.map(transaction => [
          transaction.occurred_at,
          transaction.kind,
          transaction.amount,
          transaction.category || '',
          `"${(transaction.note || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
          transaction.created_at
        ].join(','))
      ].join('\n')

      const timestamp = new Date().toISOString().split('T')[0]
      downloadFile(csvContent, `porket-transactions-${timestamp}.csv`, 'text/csv')

    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJSON = async () => {
    try {
      setIsExporting(true)
      const transactions = await fetchAllTransactions()

      if (transactions.length === 0) {
        alert('No transactions to export')
        return
      }

      const exportData = {
        exported_at: new Date().toISOString(),
        total_transactions: transactions.length,
        transactions
      }

      const jsonContent = JSON.stringify(exportData, null, 2)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadFile(jsonContent, `porket-transactions-${timestamp}.json`, 'application/json')

    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Export Data</h2>
        <span className="text-2xl">💾</span>
      </div>
      
      <div className="space-y-6">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Download all your transaction data for backup or analysis
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportAsCSV}
            disabled={isExporting}
            className="group flex items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-2xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 disabled:from-slate-100 disabled:to-slate-200 disabled:border-slate-300 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            <div className="flex-1 text-left">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-bold text-green-700 dark:text-green-300 text-lg mb-1">
                {isExporting ? '⏳ Exporting...' : 'Export as CSV'}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Excel & Google Sheets compatible
              </div>
            </div>
          </button>
          
          <button
            onClick={exportAsJSON}
            disabled={isExporting}
            className="group flex items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 disabled:from-slate-100 disabled:to-slate-200 disabled:border-slate-300 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            <div className="flex-1 text-left">
              <div className="text-3xl mb-2">🔧</div>
              <div className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">
                {isExporting ? '⏳ Exporting...' : 'Export as JSON'}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Machine-readable with metadata
              </div>
            </div>
          </button>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>💡 <strong>Pro tip:</strong> Export your data regularly for backup purposes</p>
            <p>📈 Use CSV files to analyze your spending patterns in spreadsheet apps</p>
          </div>
        </div>
      </div>
    </div>
  )
}