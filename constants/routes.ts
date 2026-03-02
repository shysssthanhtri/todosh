export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP] as string[];

export const publicRoutes = [...authRoutes] as string[];
