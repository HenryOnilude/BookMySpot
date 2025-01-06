// src/types/auth.ts
export interface RegisterData {
    email: string;
    password: string;
    name: string;
    type: "DRIVER" | "OWNER";
  }