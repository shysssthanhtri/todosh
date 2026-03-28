export const ROUTES = {
  /** Landing page (public) */
  LANDING: "/",
  /** App home after login */
  TODO_LIST: "/todos",
  UPCOMING: "/upcoming",
  DASHBOARD: "/dashboard",
  BROWSE: "/browse",
  SETTINGS_LABELS: "/settings/labels",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGET_PASSWORD: "/forget-password",
} as const;

export const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP] as string[];

export const publicRoutes = [ROUTES.LANDING, ...authRoutes] as string[];
