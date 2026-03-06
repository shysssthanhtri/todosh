export { auth as proxy } from "@/auth";

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!api|_next/static|images|_next/image|favicon.ico|opengraph-image).*)",
  ],
};
