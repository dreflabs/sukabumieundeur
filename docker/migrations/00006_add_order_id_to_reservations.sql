-- Migration 00006_add_order_id_to_reservations.sql
ALTER TABLE public.ticket_reservations
ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;

CREATE INDEX idx_ticket_reservations_order_id ON public.ticket_reservations(order_id);
