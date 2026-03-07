export const ROUTES = {
  HOME: "/",
  TODAY: "/today",
  UPCOMING: "/upcoming",
  BROWSE: "/browse",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGET_PASSWORD: "/forget-password",
} as const;

export const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP] as string[];

export const publicRoutes = [...authRoutes] as string[];
