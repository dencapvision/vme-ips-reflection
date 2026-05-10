-- Create contacts table
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert
CREATE POLICY "Enable insert for public users" ON public.contacts
    FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to view
CREATE POLICY "Enable read for authenticated users only" ON public.contacts
    FOR SELECT USING (auth.role() = 'authenticated');
