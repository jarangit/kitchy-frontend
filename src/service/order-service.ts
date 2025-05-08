import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // เปลี่ยนเป็น URL backend จริงใน production
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ สร้างออเดอร์ใหม่
export const createOrder = async (data: {
  orderNumber: string
  type: 'TOGO' | 'DINEIN'
}) => {
  const response = await api.post('/orders', data)
  return response.data
}

// ✅ ดึงรายการออเดอร์ทั้งหมด
export const fetchOrders = async () => {
  const response = await api.get('/orders')
  return response.data
}

// ✅ ลบออเดอร์ตาม ID
export const deleteOrder = async (id: number) => {
  const response = await api.delete(`/orders/${id}`)
  return response.data
}