import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import api from '@/lib/api/ssrAPI';
import { AvertraMutationResponse } from '@/lib/types/api';
import { LoginResponse } from '@/lib/types/auth';
import { MessageErrorSSR } from '@/lib/types/comments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await api.post<AvertraMutationResponse<LoginResponse>>('auth/login', body);
    const cookieStore = await cookies();

    // Set the token in a secure HTTP-only cookie
    cookieStore.set('token', response.data.data.accessToken);
    cookieStore.set('user', JSON.stringify(response.data.data.user));
    
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as MessageErrorSSR).response.data.message || "Invalid credentials" },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
} 