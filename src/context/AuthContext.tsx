import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'guest' | 'supplier' | 'buyer' | 'shipping' | '3pl' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  isAuthenticated: false,
  login: () => false,
  logout: () => {}
});

const DEMO_ACCOUNTS: Record<string, User> = {
  'supplier@brandsbridge.ai': {
    id: '3',
    name: 'Ahmad Al Sulaiti',
    email: 'supplier@brandsbridge.ai',
    company: 'Qatar National Import & Export',
    role: 'supplier'
  },
  'buyer@brandsbridge.ai': {
    id: '1',
    name: 'Mohammed Al Kuwari',
    email: 'buyer@brandsbridge.ai',
    company: 'Al Meera Consumer Goods',
    role: 'buyer'
  },
  'shipping@brandsbridge.ai': {
    id: '3',
    name: 'Gulf Logistics Team',
    email: 'shipping@brandsbridge.ai',
    company: 'Gulf Shipping Services',
    role: 'shipping'
  },
  'admin@brandsbridge.ai': {
    id: '4',
    name: 'Platform Admin',
    email: 'admin@brandsbridge.ai',
    company: 'Brands Bridge AI',
    role: 'admin'
  },
  '3pl@brandsbridge.ai': {
    id: '5',
    name: 'Gulf Cold Chain Co.',
    email: '3pl@brandsbridge.ai',
    company: 'Gulf Cold Chain Co.',
    role: '3pl'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (account && password === 'demo123') {
      setUser(account);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role ?? 'guest',
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
