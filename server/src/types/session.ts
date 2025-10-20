export interface JwtPayload {
  id: string;
  email: string;
}

export interface SessionData {
  user: JwtPayload | null;
}
