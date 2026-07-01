import { createContext, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getDecryptedData } from '@/utils';

// فایل: src/contexts/AuthContext.tsx

export const initialAuthState = {
  accessToken: 'DEV_TOKEN_123', // یه توکن الکی که سیستم رو گول بزنه
  id: 'dev-user-001',
  name: 'Developer Mode',
  email: 'dev@test.com',
  avatar: '',
};


interface AuthContextType {
  auth: typeof initialAuthState;
  setAuth: React.Dispatch<React.SetStateAction<typeof initialAuthState>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: initialAuthState,
  setAuth: () => {},
  persist: true,
  setPersist: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookies] = useCookies(['userDetails']);
  const currentState = cookies.userDetails
    ? { accessToken: '', ...getDecryptedData(cookies.userDetails) }
    : initialAuthState;
  const [auth, setAuth] = useState(currentState);

  const initialPersist = localStorage.getItem('persist');
  const [persist, setPersist] = useState<boolean>(
    initialPersist ? JSON.parse(initialPersist) : true,
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
