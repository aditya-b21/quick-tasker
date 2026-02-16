-- Create content types enum
CREATE TYPE public.content_type AS ENUM ('short_form', 'long_form', 'graphic_design', 'hero');

-- Create content table for all media
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type content_type NOT NULL,
  title TEXT NOT NULL,
  embed_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Public read access for all content (portfolio is public)
CREATE POLICY "Content is publicly readable" 
ON public.content 
FOR SELECT 
USING (true);

-- Admin table for managing who can edit
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin list
CREATE POLICY "Admins can view admin list"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- Admin-only write policies for content
CREATE POLICY "Admins can insert content"
ON public.content
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update content"
ON public.content
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete content"
ON public.content
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Media is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();