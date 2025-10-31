import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

interface WaitlistRequest {
  email: string;
  score?: number;
  source?: string;
}

export async function POST(request: Request) {
  try {
    const body: WaitlistRequest = await request.json();

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Insert into waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: body.email.toLowerCase().trim(),
        score: body.score || null,
        source: body.source || 'web',
      })
      .select()
      .single();

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already registered on waitlist' },
          { status: 409 }
        );
      }

      console.error('Waitlist insert error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Log event
    await supabase.from('events').insert({
      event_type: 'waitlist_joined',
      properties: {
        email: body.email,
        score: body.score,
        source: body.source,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data,
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getServerSupabase();

    // Get waitlist count
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Waitlist count error:', error);
      return NextResponse.json(
        { error: 'Failed to get waitlist count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: count || 0,
    });
  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
