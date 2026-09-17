import {
  createContext,
  use,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { loginRequest } from "@/lib/api";
import { useStorageState } from "@/lib/use-storage-state";

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session: string | null;
  user: AuthUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useSession() {
  const value = use(AuthContext);

  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[, userJson], setUserJson] = useStorageState("user");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const user = useMemo<AuthUser | null>(() => {
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  }, [userJson]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading: isLoading || isSigningIn,
      signIn: async (email: string, password: string) => {
        setIsSigningIn(true);

        try {
          const result = await loginRequest(email, password);
          setSession(result.token);
          setUserJson(JSON.stringify(result.user));
        } finally {
          setIsSigningIn(false);
        }
      },
      signOut: () => {
        setSession(null);
        setUserJson(null);
      },
    }),
    [session, user, isLoading, isSigningIn, setSession, setUserJson],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
