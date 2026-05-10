import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 1. Insert into Supabase
    const supabase = createClient();
    const { data: contact, error: dbError } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Send Email via Resend
    await sendEmail({
      to: 'admin@cap-vision.com', // TODO: Change to actual admin email
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 3. Optional: Trigger LINE Worker Proxy
    // fetch('https://your-worker-url.workers.dev/notify', {
    //   method: 'POST',
    //   body: JSON.stringify({ message: `New contact from ${name}` }),
    // });

    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
