export type UserRole = 'admin' | 'client'
export type ProjectStatus = 'pending' | 'in_progress' | 'delivered'
export type PaymentStatus = 'paid' | 'pending'

export interface User {
  id: string; email: string; name: string; role: UserRole; created_at: string
}
export interface Client {
  id: string; user_id: string; project_name: string
  status: ProjectStatus; payment_status: PaymentStatus; created_at: string
}
export interface Asset {
  id: string; client_id: string; url: string; created_at: string
}
export interface Project {
  id: string; title: string; category: 'studio' | 'tech' | 'ia'
  description: string; media_url: string
}
export interface Payment {
  id: string; client_id: string; status: PaymentStatus; amount: number; date: string
}
