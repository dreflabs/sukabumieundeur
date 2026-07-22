export type UserRole = 'SUPER_ADMIN' | 'MODULE_ADMIN' | 'ORGANISER' | 'ARTIST' | 'MEMBER' | 'GUEST';
export type OrderStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type TicketStatus = 'RESERVED' | 'ISSUED' | 'CHECKED_IN' | 'CANCELLED';
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  start_date: string;
  end_date: string;
  banner_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketCategory {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  quota: number;
  available_quota: number;
  max_per_transaction: number;
  sale_start: string;
  sale_end: string;
  created_at: string;
  updated_at: string;
}

export interface TicketReservation {
  id: string;
  user_id: string;
  ticket_category_id: string;
  quantity: number;
  expires_at: string;
  status: 'HOLD' | 'CONVERTED' | 'EXPIRED';
  created_at: string;
}

export interface MerchProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  base_price: number;
  category: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  snap_token?: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}
