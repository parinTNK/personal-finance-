'use client'

import { useEffect, useState } from 'react'
import { supabase, type Transaction } from '@/lib/supabase'

interface TransactionListProps {
  refreshTrigger?: number
  onTransactionDeleted?: () => void
}

export default function TransactionList({ refreshTrigger, onTransactionDeleted }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const ITEMS_PER_PAGE = 3

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('occurred_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
      } else {
        const allData = data || []
        setAllTransactions(allData)
        setTransactions(allData.slice(0, ITEMS_PER_PAGE)) // Show first 6 by default
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowAll = () => {
    setShowAll(true)
    setCurrentPage(1)
    updateDisplayedTransactions(1)
  }

  const updateDisplayedTransactions = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setTransactions(allTransactions.slice(startIndex, endIndex))
  }

  const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateDisplayedTransactions(page)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
 

    setDeletingIds(prev => new Set(prev).add(transactionId))

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

      if (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction. Please try again.')
      } else {
        // Refresh the transaction list
        await fetchTransactions()
        // Notify parent component to refresh summary
        onTransactionDeleted?.()
        
        // Adjust current page if needed
        const newTotalPages = Math.ceil((allTransactions.length - 1) / ITEMS_PER_PAGE)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete transaction. Please try again.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(transactionId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [refreshTrigger])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatAmount = (amount: number, kind: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
    
    return kind === 'expense' ? `-${formatted}` : `+${formatted}`
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Transactions</h2>
        <div className="text-center py-8 text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Recent Transactions</h2>
        <span className="text-2xl">📋</span>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏦</div>
          <p className="text-slate-500 text-lg">
            No transactions yet
          </p>
          <p className="text-slate-400">
            Add your first transaction above!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-md group ${
                deletingIds.has(transaction.id) ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      transaction.kind === 'income' 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                  >
                    <span className="text-white text-xs font-bold">
                      {transaction.kind === 'income' ? '+' : '-'}
                    </span>
                  </div>
                  
                  <span className="text-sm font-medium text-slate-500">
                    {formatDate(transaction.occurred_at)}
                  </span>
                  
                  {transaction.category && (
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
                      {transaction.category}
                    </span>
                  )}
                </div>
                
                {transaction.note && (
                  <div className="text-sm text-slate-600 ml-7">
                    {transaction.note}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div
                    className={`font-bold text-lg ${
                      transaction.kind === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatAmount(transaction.amount, transaction.kind)}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  disabled={deletingIds.has(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 transition-all duration-200 text-red-500 hover:text-red-600 disabled:opacity-50"
                  title="Delete transaction"
                >
                  {deletingIds.has(transaction.id) ? (
                    <span className="text-sm">⏳</span>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
          
          {/* Pagination Controls */}
          {allTransactions.length > ITEMS_PER_PAGE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, allTransactions.length)} of {allTransactions.length} transactions
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ←
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl border transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}