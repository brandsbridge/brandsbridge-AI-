import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
  isDemo: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  isAuthenticated: false,
  isDemo: false,
  loading: true,
  login: async () => false,
  loginAsDemo: async () => false,
  logout: async () => {},
});

const DEMO_SESSION_KEY = 'brandsbridge_demo_user';

export const DEMO_ACCOUNTS: Record<string, User> = {
  'supplier@brandsbridge.ai': {
    id: '3',
    name: 'Ahmad Al Sulaiti',
    email: 'supplier@brandsbridge.ai',
    company: 'Qatar National Import & Export',
    role: 'supplier',
  },
  'buyer@brandsbridge.ai': {
    id: '1',
    name: 'Mohammed Al Kuwari',
    email: 'buyer@brandsbridge.ai',
    company: 'Al Meera Consumer Goods',
    role: 'buyer',
  },
  'shipping@brandsbridge.ai': {
    id: '3',
    name: 'Gulf Logistics Team',
    email: 'shipping@brandsbridge.ai',
    company: 'Gulf Shipping Services',
    role: 'shipping',
  },
  'admin@brandsbridge.ai': {
    id: '4',
    name: 'Platform Admin',
    email: 'admin@brandsbridge.ai',
    company: 'Brands Bridge AI',
    role: 'admin',
  },
  '3pl@brandsbridge.ai': {
    id: '5',
    name: 'Gulf Cold Chain Co.',
    email: '3pl@brandsbridge.ai',
    company: 'Gulf Cold Chain Co.',
    role: '3pl',
  },
};

const VALID_ROLES: readonly Role[] = ['guest', 'supplier', 'buyer', 'shipping', '3pl', 'admin'] as const;

const isRole = (value: unknown): value is Role =>
  typeof value === 'string' && (VALID_ROLES as readonly string[]).includes(value);

const hydrateUserFromFirestore = async (fbUser: FirebaseUser): Promise<User | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    if (!snap.exists()) {
      console.warn(`[Auth] No Firestore profile at /users/${fbUser.uid}`);
      return null;
    }
    const data = snap.data();
    const role: Role = isRole(data.role) ? data.role : 'guest';
    return {
      id: fbUser.uid,
      name: typeof data.name === 'string' ? data.name : fbUser.displayName ?? '',
      email: typeof data.email === 'string' ? data.email : fbUser.email ?? '',
      company: typeof data.company === 'string' ? data.company : '',
      role,
    };
  } catch (err) {
    console.error(`[Auth] Failed to load /users/${fbUser.uid}`, err);
    return null;
  }
};

const readStoredDemoUser = (): User | null => {
  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (!parsed?.email || !isRole(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  // Ref mirrors isDemo so the onAuthStateChanged closure sees the live value.
  const isDemoRef = useRef(false);

  useEffect(() => {
    const stored = readStoredDemoUser();
    if (stored) {
      isDemoRef.current = true;
      setUser(stored);
      setIsDemo(true);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (isDemoRef.current) {
        // Demo session active — ignore Firebase auth changes entirely.
        return;
      }
      if (fbUser) {
        const hydrated = await hydrateUserFromFirestore(fbUser);
        setUser(hydrated);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const hydrated = await hydrateUserFromFirestore(cred.user);
      if (!hydrated) {
        await firebaseSignOut(auth);
        return false;
      }
      try { sessionStorage.removeItem(DEMO_SESSION_KEY); } catch { /* ignore */ }
      isDemoRef.current = false;
      setIsDemo(false);
      setUser(hydrated);
      return true;
    } catch (err) {
      console.error('[Auth] login failed', err);
      return false;
    }
  };

  const loginAsDemo = async (email: string): Promise<boolean> => {
    const profile = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!profile) return false;

    isDemoRef.current = true;
    try {
      await firebaseSignOut(auth);
    } catch { /* no active Firebase session */ }
    try {
      sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(profile));
    } catch { /* sessionStorage unavailable — runtime state still applies */ }

    setUser(profile);
    setIsDemo(true);
    setLoading(false);
    return true;
  };

  const logout = async (): Promise<void> => {
    try { sessionStorage.removeItem(DEMO_SESSION_KEY); } catch { /* ignore */ }
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('[Auth] logout failed', err);
    }
    isDemoRef.current = false;
    setIsDemo(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? 'guest',
        isAuthenticated: !!user,
        isDemo,
        loading,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
