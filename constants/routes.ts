export const ROUTES = {
  /** Landing page (public) */
  LANDING: "/",
  /** App home after login */
  HOME: "/today",
  TODAY: "/today",
  UPCOMING: "/upcoming",
  BROWSE: "/browse",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGET_PASSWORD: "/forget-password",
} as const;

export const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP] as string[];

export const publicRoutes = [ROUTES.LANDING, ...authRoutes] as string[];
