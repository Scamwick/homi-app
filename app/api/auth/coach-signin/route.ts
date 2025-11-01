import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual authentication logic
    // For now, this is a placeholder that demonstrates the structure

    // Example using Supabase (uncomment when ready):
    /*
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is a coach (you'd need a coaches table or role field)
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('*')
      .eq('email', email)
      .single();

    if (coachError || !coachData) {
      return NextResponse.json(
        { error: 'Not authorized as a coach' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      token: data.session?.access_token,
      coach: {
        id: coachData.id,
        email: coachData.email,
        name: coachData.name,
      }
    });
    */

    // Temporary mock authentication for development
    // Remove this in production!
    if (email === 'demo@coach.com' && password === 'demo123') {
      return NextResponse.json({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        coach: {
          id: 'demo-coach-1',
          email: email,
          name: 'Demo Coach',
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Coach sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
