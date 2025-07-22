import React, { useContext } from "react";
import Header from "../components/header/header";
import Board from "../components/board/Board";
import SearchUserResult from "../components/searchUser/SearchUserResult";
import LeftDrawra from "../components/leftdrawar/LeftDrawra";
import RightDrawar from "../components/rightDrawar/RightDrawar";
import Notification from "../components/notification/Notification";
import { getSocket } from "../context/SocketProvider";

function Home() {

  const socket = getSocket()
  
  return (
    <div
      style={{ 
            backgroundColor: "#24201f", height: "100vh", overflow: "auto" , scrollbarWidth: "none" }}
    >
      <Header />
      <Board />

      <SearchUserResult/>
      <LeftDrawra/>
      {/* for chat */}
      <RightDrawar/>
      {/* notification */}
      <Notification/>
    </div>
  );
}

export default Home;
