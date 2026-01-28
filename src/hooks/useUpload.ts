import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File, bucket: string, path: string) => {
        try {
            setUploading(true);
            setError(null);

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${path}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                console.error("Supabase Storage Upload Error:", uploadError);
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return { path: filePath, url: data.publicUrl };

        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading, error };
};
