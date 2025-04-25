import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import api from '@/lib/api/ssrAPI';
import { cookies } from 'next/headers';
import { MessageErrorSSR } from '@/lib/types/comments';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/register', body);
    const cookieStore = await cookies();

    cookieStore.set('token', response.data.data.accessToken);
    cookieStore.set('user', JSON.stringify(response.data.data.user));

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as MessageErrorSSR).response.data.message ||
          'An error occurred during registration',
      },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
}
