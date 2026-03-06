export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGET_PASSWORD: "/forget-password",
} as const;

export const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP] as string[];

export const publicRoutes = [
  ...authRoutes,
  "/opengraph-image", // Required for Facebook/social crawlers to fetch OG image
] as string[];
