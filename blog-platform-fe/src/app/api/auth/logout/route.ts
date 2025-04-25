import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MessageErrorSSR } from '@/lib/types/comments';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('user');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as MessageErrorSSR).response.data.message || 'An error occurred during logout',
      },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
}
