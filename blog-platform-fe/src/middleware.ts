import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const privatePaths = ['/posts/create', '/posts/edit'];

// Function to check if the path is public
const isPrivatePath = (path: string) => {
  return privatePaths.some(privatePaths => path.startsWith(privatePaths));
};

// we need to check if the user is has uploaded his cv or not and we need to check he verified his email or not
// we need to validate the token is it's valid or not and we need to have the secret key to verify the token
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  // Get the path from the request
  const path = request.nextUrl.pathname;
  // Get the token from session
  const token = cookieStore.get('token')?.value;
  const isAuthenticated = !!token;

  if (isAuthenticated && path.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && isPrivatePath(path)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /images, etc.
     */
    '/((?!api|_next|static|fonts|images|favicon.ico).*)',
  ],
};
