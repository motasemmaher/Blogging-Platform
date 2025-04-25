import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import api from '@/lib/api/ssrAPI';
import { MessageErrorSSR } from '@/lib/types/comments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const response = await api.get(`/posts/${id}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    // Handle errors with proper typing
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    const statusCode = (error as MessageErrorSSR)?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { id } = await params;
    const response = await api.put(`/posts/${id}`, body);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    // Handle errors with proper typing
    const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
    const statusCode = (error as MessageErrorSSR)?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const response = await api.delete(`/posts/${id}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    // Handle errors with proper typing
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
    const statusCode = (error as MessageErrorSSR)?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
