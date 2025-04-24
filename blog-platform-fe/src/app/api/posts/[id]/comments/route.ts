import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import api from '@/lib/api/ssrAPI';
import { MessageErrorSSR } from '@/lib/types/comments';
interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const response = await api.get(`/posts/${params.id}/comments`);
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
    const response = await api.post(`/posts/${params.id}/comments`, {
      ...body,
      postId: params.id,
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as MessageErrorSSR).response.data.message || 'Failed to create comment' },
      { status: (error as MessageErrorSSR).status || 500 }
    );
  }
}