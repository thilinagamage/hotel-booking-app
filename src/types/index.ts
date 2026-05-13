export type ApiMessage = {
  message?: string;
  error?: string;
};

export type SessionPayload = {
  userId: string;
  role: "GUEST" | "ADMIN";
  expiresAt: Date;
};
