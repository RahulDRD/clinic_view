import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req: any) {
  // Custom logic if needed
}, {
  isReturnToCurrentPage: true,
  loginPage: "/api/auth/login",
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
