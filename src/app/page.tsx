'use client'

import { useState } from 'react'
import TransactionForm from '@/components/transaction-form'
import TransactionList from '@/components/transaction-list'
import MonthlySummary from '@/components/monthly-summary'

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleTransactionDeleted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FM</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enjoy Food
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">


          {/* Transaction List */}
          {/* Transaction Form - Prominent placement */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl -m-2"></div>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </section>
                <section>
            <TransactionList 
              refreshTrigger={refreshTrigger} 
              onTransactionDeleted={handleTransactionDeleted}
            />
          </section>

          {/* Monthly Summary */}
          <section>
            <MonthlySummary refreshTrigger={refreshTrigger} />
          </section>
    


        </div>
      </div>
    </div>
  )
}
