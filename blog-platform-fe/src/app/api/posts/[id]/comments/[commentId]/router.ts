import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import api from '@/lib/api/ssrAPI';
import { MessageErrorSSR } from "@/lib/types/comments";

interface RouteParams {
  params: {
    id: string;
    commentId: string;
  };
}
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
      const response = await api.delete(`/posts/${params.id}/comments/${params.commentId}`);
      
      return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
      // Handle errors with proper typing
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      const statusCode = (error as MessageErrorSSR)?.status || 500;
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }
  } 