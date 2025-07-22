import { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export const SocketContext = createContext();

export const getSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { token } = useSelector((state) => state?.loginUser || {});

  const socket = useMemo(() => {
    if (!token) return null; 

    return io("https://multiplayer-tik-tak-toe.onrender.com", {
      withCredentials: true,
      auth: {
        token: token,
      },
    });
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
