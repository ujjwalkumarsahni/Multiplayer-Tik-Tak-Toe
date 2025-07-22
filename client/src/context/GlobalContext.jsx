import { createContext, useMemo, useState } from "react";
import io from 'socket.io-client'
export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

 


  const [isSearchUser,setIsSearchUser] = useState(false)
  const [isDrawar,setIsDrawar] = useState(false);
  const [isRightDrawar,setIsRightDrawar] = useState(false)
  const [isNotification,setIsNotification] = useState(false)
  const [searchUserName, setSearchUserName] = useState("");
  const [messages, setMessages] =useState([]);
  return (
    <GlobalContext.Provider value={{ board, setBoard,isSearchUser,setIsSearchUser,isDrawar,setIsDrawar,isRightDrawar,setIsRightDrawar,isNotification,setIsNotification,searchUserName, setSearchUserName,messages, setMessages}}>
      {children}
    </GlobalContext.Provider>
  );
}
