"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageTransition from '@/components/PageTransition/PageTransition'
import { toast } from 'react-toastify'
import AuthGuard from '@/components/auth/AuthGuard'

interface Order {
  id: string
  items: any[]
  total: number
  status: string
  createdAt: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  return (
    <AuthGuard>
      {(session) => {
        useEffect(() => {
          const fetchOrders = async () => {
            try {
              // If you need to send a token, use session?.accessToken or session?.user?.email, etc.
              const response = await fetch('/api/orders', {
                // headers: { Authorization: `Bearer ${session?.accessToken}` }
              })
              if (!response.ok) throw new Error('Failed to fetch orders')
              const data = await response.json()
              setOrders(data)
            } catch (error) {
              toast.error('Failed to load orders')
            } finally {
              setIsLoading(false)
            }
          }
          fetchOrders()
        }, [session])

        if (isLoading) return <div>Loading...</div>

        return (
          <PageTransition>
            <div className="container mx-auto px-6 py-24">
              <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
              {orders.length === 0 ? (
                <p>No orders found</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <span className="px-3 py-1 rounded-full bg-gray-100">
                          {order.status}
                        </span>
                      </div>
                      {/* Add order details */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageTransition>
        )
      }}
    </AuthGuard>
  )
}