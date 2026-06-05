import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {

    const [user, setUser] =
      useState(null);

    const [loading, setLoading] =
      useState(true);

      const API = import.meta.env.VITE_API_URL
      
    const login = async (
  email,
  password,
  deviceId,
  deviceName
) => {

  const response =
    await axios.post(
      `${API}/auth/login`,
      {
        email,
        password,
        deviceId,
        deviceName,
      },
      {
        withCredentials: true,
      }
    );

  setUser(
    response.data.user
  );
};

    const logout =
      async () => {

        await axios.post(
          `${API}/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );

        setUser(null);

      };

    useEffect(() => {

      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (storedUser) {

        setUser(
          JSON.parse(
            storedUser
          )
        );

      }

      setLoading(false);

    }, []);

    useEffect(() => {

      if (user) {

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

      } else {

        localStorage.removeItem(
          "user"
        );

      }

    }, [user]);

    return (

      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
        }}
      >

        {children}

      </AuthContext.Provider>

    );

  };

export const useAuth =
  () =>
    useContext(
      AuthContext
    );