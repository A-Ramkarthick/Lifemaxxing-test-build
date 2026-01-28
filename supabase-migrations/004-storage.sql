-- 004-storage.sql
-- Sets up the 'user-data' storage bucket and policies.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-data', 'user-data', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Policies for Security

-- Allow public read access (Required for displaying images in the app)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'user-data' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'user-data' AND auth.uid() = owner );

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'user-data' AND auth.uid() = owner );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'user-data' AND auth.uid() = owner );
