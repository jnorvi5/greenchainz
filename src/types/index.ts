export type UserRole = 'buyer' | 'supplier' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  company?: string
  phone?: string
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  currency: string
  minimumOrder: number
  unit: string
  images: string[]
  certifications: string[]
  specifications: Record<string, any>
  supplierId: string
  supplier: User
  isActive: boolean
  sustainabilityScore?: number
  createdAt: string
  updatedAt: string
}

export interface RFQ {
  id: string
  title: string
  description: string
  category: string
  quantity: number
  unit: string
  targetPrice?: number
  currency: string
  deadline: string
  buyerId: string
  buyer: User
  responses: RFQResponse[]
  status: 'open' | 'closed' | 'awarded'
  createdAt: string
  updatedAt: string
}

export interface RFQResponse {
  id: string
  rfqId: string
  supplierId: string
  supplier: User
  price: number
  currency: string
  deliveryTime: number
  description: string
  attachments?: string[]
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  children?: Category[]
}