import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a separate admin client just for this route
// User MUST add SUPABASE_SERVICE_ROLE_KEY to .env for this to work
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: 'Server Configuration Error: SUPABASE_SERVICE_ROLE_KEY missing.' }, { status: 500 });
    }

    // 1. Find User ID by Email (Admin only)
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    // In a real app with many users, listUsers is paginated and inefficient used this way. 
    // Ideally we assume the email is valid or use 'getUserById' if we knew the ID.
    // Better approach: use admin.updateUserById but we need ID.
    // Let's filter the list.
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update Password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    );

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Admin Reset Error:", error);
    return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 500 });
  }
}
