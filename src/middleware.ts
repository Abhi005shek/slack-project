import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
 const isLoggedIn = await convexAuth.isAuthenticated();

  // Redirect authenticated users away from /auth
  if (isAuthPage(request) && isLoggedIn) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // Redirect unauthenticated users away from everything else
  if (!isAuthPage(request) && !isLoggedIn) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
