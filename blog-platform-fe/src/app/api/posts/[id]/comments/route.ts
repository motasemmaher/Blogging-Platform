import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import api from '@/lib/api/ssrAPI';
import { MessageErrorSSR } from '@/lib/types/comments';


interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const response = await api.get(`/posts/${id}/comments`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as MessageErrorSSR).response.data.message || 'Failed to fetch comments' },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { id } = await params;
    const response = await api.post(`/posts/${id}/comments`, {
      ...body,
      postId: id,
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as MessageErrorSSR).response.data.message || 'Failed to create comment' },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
}