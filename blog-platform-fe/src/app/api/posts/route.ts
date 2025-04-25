import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import api from '@/lib/api/ssrAPI';
import { MessageErrorSSR } from '@/lib/types/comments';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    const response = await api.get('/posts', {
      params: { page, limit, search },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    // Handle errors with proper typing
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    const statusCode = (error as MessageErrorSSR)?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await api.post('/posts', body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    // Handle errors with proper typing
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    const statusCode = (error as MessageErrorSSR)?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
