'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

// 一時的にsupabaseクライアントを直接作成
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Category {
  id: number
  name: string
  color: string
}

interface Expense {
  id: number
  amount: number
  discount_amount: number
  passed_amount: number
  description: string
  category_id: number
  expense_date: string
  categories: Category
}

export default function ExpensesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // フォーム状態
  const [amount, setAmount] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [passedAmount, setPassedAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])

  // データ状態
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // カテゴリ取得
  useEffect(() => {
    if (user) {
      fetchCategories()
      fetchExpenses()
    }
  }, [user])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
  }

  const fetchExpenses = async () => {
    if (!user?.id) return;
    
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('expense_date', { ascending: false })
  
    if (expenseError) {
      console.error('Error fetching expenses:', expenseError)
      return
    }
  
    // カテゴリ情報を個別に取得
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
  
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      return
    }
  
    // データを結合
    const expensesWithCategories = expenseData?.map(expense => ({
      ...expense,
      categories: categoriesData?.find(cat => cat.id === expense.category_id) || { name: '不明', color: '#gray' }
    }))
  
    setExpenses(expensesWithCategories || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
  
    setIsSubmitting(true)
  
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: parseInt(amount),
          discount_amount: parseInt(discountAmount) || 0,
          passed_amount: parseInt(passedAmount) || 0,
          description: description.trim(),
          category_id: parseInt(categoryId),
          expense_date: expenseDate,
        })
  
      if (error) throw error
  
      // フォームリセット
      setAmount('')
      setDiscountAmount('')
      setPassedAmount('')
      setDescription('')
      setCategoryId('')
      setExpenseDate(new Date().toISOString().split('T')[0])
  
      // 記録一覧を再取得
      await fetchExpenses()
  
      alert('支出記録を保存しました！')
    } catch (error: any) {
      console.error('Error saving expense:', error)
      alert('保存に失敗しました: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">支出記録</h1>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 記録フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">新しい支出を記録</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  金額 *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  値引き額
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  見送り額
                </label>
                <input
                  type="number"
                  value={passedAmount}
                  onChange={(e) => setPassedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="コーヒー、ランチなど"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日付 *
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '記録を保存'}
            </button>
          </form>
        </div>

        {/* 記録一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">記録一覧</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">まだ記録がありません</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: expense.categories.color }}
                        ></span>
                        <span className="font-medium">{expense.categories.name}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-600">{expense.expense_date}</span>
                      </div>
                      {expense.description && (
                        <p className="text-gray-700 mb-2">{expense.description}</p>
                      )}
                      <div className="flex space-x-4 text-sm">
                        <span>支出: ¥{expense.amount.toLocaleString()}</span>
                        {expense.discount_amount > 0 && (
                          <span className="text-green-600">
                            値引: ¥{expense.discount_amount.toLocaleString()}
                          </span>
                        )}
                        {expense.passed_amount > 0 && (
                          <span className="text-blue-600">
                            見送: ¥{expense.passed_amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}