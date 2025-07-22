import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Avatar, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getSocket } from "../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setCurrentPlayingUser,
  setIsPlayerRequested,
  setIsPlaying,
  setOponentPlayer,
} from "../../store/userSlice";
import { GlobalContext } from "../../context/GlobalContext";
import Loader from "../loader/Loader";
import { useNavigationBlocker } from "../../hook/BlockNavigate";

// Styled game cell
const Cell = styled(Box)(() => ({
  width: "100px",
  height: "100px",
  border: "2px solid #000",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  backgroundColor: "#463b39",
  color: "white",
  cursor: "pointer",
}));

export default function Board() {
  const [room, setRoom] = useState({
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    player1: { name: "", avatar: "", symbol: "" },
    player2: { name: "", avatar: "", symbol: "" },
    currentTurn: "",
    winner: "",
  });
  const moveSound = new Audio("../../../sounds/move.mp3.mp3");
  const loseSound = new Audio("../../../sounds/lose.mp3.mp3");
  const winSound = new Audio("../../../sounds/victory.mp3.mp3");
  const drawSound = new Audio("../../../sounds/draw.mp3.mp3");

  const [playerRole, setPlayerRole] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const dispatch = useDispatch();
  const { setMessages } = useContext(GlobalContext);
  const { userName, isPlayerRequested, isPlaying } = useSelector(
    (state) => state.loginUser
  );
  const { socket } = getSocket();
  useNavigationBlocker(isGameStarted); // ✅ Prevent navigation once game starts

  // Game state updates from server
  useEffect(() => {
    if (!socket) return;

    const handleRoom = (data) => {
      const oponentPlayer =
        data.player1.name === userName ? data.player2 : data.player1;

      setRoom({
        board: data.board || [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        player1: data.player1,
        player2: data.player2,
        currentTurn: data.currentTurn,
        winner: "",
      });

      dispatch(setOponentPlayer(oponentPlayer));
      dispatch(setIsPlayerRequested(false));
      setIsGameStarted(true); // ✅ Lock game
      setPlayerRole(data.player1.name === userName ? "player1" : "player2");
    };

    const handlePlayerMove = (data) => {
      moveSound.play();
      setRoom((prev) => ({
        ...prev,
        board: data.board,
        currentTurn: data.currentTurn,
      }));
    };

    const getWinnerHandler = (data) => {
      if (data.winner.name == userName) {
        toast.success(`you win`);
        winSound.play();
      } else {
        toast.error(`you lose`);
        loseSound.play();
      }
      dispatch(setOponentPlayer(""));
      resetGame();
    };

    const handleMatchDraw = () => {
      toast.success("Match Draw");
      drawSound.play()
      dispatch(setOponentPlayer(""));
      resetGame();
    };

    const resetGame = () => {
      setRoom({
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        player1: { name: "", avatar: "", symbol: "" },
        player2: { name: "", avatar: "", symbol: "" },
        currentTurn: "",
        winner: "",
      });
      setMessages([]);
      dispatch(setIsPlaying(false));
      setIsGameStarted(false); // ✅ Unlock navigation
    };

    const handleCurrentPlayingUsers = (currentPlayingUsers) => {
      dispatch(setCurrentPlayingUser(currentPlayingUsers?.currentPlayingUser));
    };

    socket.on("ACCEPT_FRIEND_REQUEST", handleRoom);
    socket.on("PLAYER_MOVE", handlePlayerMove);
    socket.on("GET_WINNER", getWinnerHandler);
    socket.on("MATCH_DRAW", handleMatchDraw);
    socket.on("CURRENT_PLAYERS", handleCurrentPlayingUsers);
    return () => {
      socket.off("ACCEPT_FRIEND_REQUEST", handleRoom);
      socket.off("PLAYER_MOVE", handlePlayerMove);
      socket.off("GET_WINNER", getWinnerHandler);
      socket.off("MATCH_DRAW", handleMatchDraw);
    };
  }, [socket, userName]);

  const pulseAnimation = {
    "@keyframes pulse": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.1)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  };

  // User move
  const handleBoardClick = (i, j) => {
    const board = room.board;
    if (board[i][j] !== "" || room.winner !== "") return;
    if (room.currentTurn !== playerRole) {
      toast.error("Not your turn");
      return;
    }

    const symbol =
      room.currentTurn === "player1"
        ? room.player1.symbol
        : room.player2.symbol;

    const updatedBoard = board.map((row, i1) =>
      row.map((cell, j1) => (i1 === i && j1 === j ? symbol : cell))
    );

    const nextTurn = room.currentTurn === "player1" ? "player2" : "player1";

    setRoom((prev) => ({
      ...prev,
      board: updatedBoard,
      currentTurn: nextTurn,
    }));

    socket.emit("PLAYER_MOVE", {
      board: updatedBoard,
      currentTurn: nextTurn,
      player1: room.player1,
      player2: room.player2,
    });
  };

  if (!socket) {
    return (
      <Box
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        Connecting to game server...
      </Box>
    );
  }

  return (
    <>
      {room.currentTurn ? (
        <Box
          sx={{
            width: "100%",
            height: "86vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#24201f",
            flexDirection: "column",
            gap: 3,
            pt: 4,
          }}
        >
          {/* Player Info */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {["player1", "player2"].map((pKey) => {
              const isCurrent = room.currentTurn === pKey;
              return (
                <Box
                  key={pKey}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: isCurrent ? "#fdd835" : "#1e1e1e",
                    px: 2,
                    py: 1,
                    borderRadius: "10px",
                    boxShadow: isCurrent ? "0 0 10px #fdd835" : "none",
                  }}
                >
                  <Avatar src={room[pKey].avatar} alt={room[pKey].name} />
                  <Typography sx={{ color: "white", fontWeight: "bold" }}>
                    {room[pKey].name} ({room[pKey].symbol})
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Game Board */}
          <Box>
            {room.board.map((row, i) => (
              <Box key={i} sx={{ display: "flex" }}>
                {row.map((val, j) => (
                  <Cell
                    key={`${i}-${j}`}
                    onClick={() => handleBoardClick(i, j)}
                  >
                    {val}
                  </Cell>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!isPlayerRequested ? (
            <Typography
              variant="h5"
              sx={{
                color: "white",
                animation: "pulse 1.5s ease-in-out infinite",
                ...pulseAnimation,
              }}
            >
              Request Player To Join
            </Typography>
          ) : (
            <Loader />
          )}
        </Box>
      )}
    </>
  );
}
