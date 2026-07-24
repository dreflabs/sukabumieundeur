-- Add Composite Index for ticket_reservations on status and expires_at
-- This optimizes the cron job that releases expired zombie quotas

CREATE INDEX IF NOT EXISTS idx_ticket_reservations_status_expires_at 
ON public.ticket_reservations (status, expires_at);
