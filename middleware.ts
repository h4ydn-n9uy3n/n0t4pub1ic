import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow authenticated users
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    // Add routes that require authentication here
    "/profile/:path*",
    "/dashboard/:path*",
    "/api/protected/:path*",
  ],
};
