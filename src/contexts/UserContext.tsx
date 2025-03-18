import { createContext, useState, useEffect, ReactNode } from "react";

type UserContextType = {
  username: string | null;
  setUsername: (username: string) => void;
  isLoggedIn: boolean;
  logout: () => void;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  loginError: string | null;
};

export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
  isLoggedIn: false,
  logout: () => {},
  checkUsernameAvailability: async () => true,
  loginError: null,
});

// In-memory storage of usernames (would be replaced by DB in production)
const activeUsernames = new Set<string>();

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Load username from localStorage on initial render
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsernameState(savedUsername);
      activeUsernames.add(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("username", name);
    activeUsernames.add(name);
    setIsLoggedIn(true);
    setLoginError(null);
  };

  const logout = () => {
    if (username) {
      activeUsernames.delete(username);
    }
    localStorage.removeItem("username");
    setUsernameState(null);
    setIsLoggedIn(false);
  };

  const checkUsernameAvailability = async (name: string): Promise<boolean> => {
    // Validate username format
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9.]*$/;

    if (name.length < 3) {
      setLoginError("Username must be at least 3 characters long");
      return false;
    }

    if (!usernameRegex.test(name)) {
      setLoginError(
        "Username must start with a letter and contain only letters, numbers, and dots"
      );
      return false;
    }

    // Check if username is already taken
    if (activeUsernames.has(name)) {
      setLoginError("Username is already taken");
      return false;
    }

    return true;
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        isLoggedIn,
        logout,
        checkUsernameAvailability,
        loginError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
