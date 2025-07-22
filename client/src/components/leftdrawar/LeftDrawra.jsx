import * as React from "react";
import {
  Box,
  Drawer,
  Avatar,
  Typography,
  Button,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { GlobalContext } from "../../context/GlobalContext";
import { getSocket } from "../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { getActiveUsers } from "../../helper/helper";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  setFriendReqEmpty,
  setFriendRequest,
  setIsPlayerRequested,
  setIsPlaying,
} from "../../store/userSlice";

export default function LeftDrawra() {
  const { isDrawar, setIsDrawar } = React.useContext(GlobalContext);
  const [searchInput, setSearchInput] = React.useState("");
  const [activeUsers, setActiveUsers] = React.useState([]);
  const { userName: currentUserName } = useSelector(
    (state) => state?.loginUser || {}
  );
  const { isPlaying: isLoginUserPlaying } = useSelector(
    (state) => state?.loginUser
  );
  const { socket } = getSocket();
  const dispatch = useDispatch();
  // 🔄 Listen for active user updates
  useEffect(() => {
    if (!socket) return;

    socket.emit("GET_ACTIVE_USERS", {});

    const handleActiveUsers = (data) => {
      setActiveUsers(data?.activeuser || []);
    };

    const getFrindRequest = (data) => {
      dispatch(setFriendRequest(data?.sender));
    };

    const handleIsPlaying = (data) => {
      dispatch(setIsPlaying(data));
      dispatch(setFriendReqEmpty());
    };

    socket.on("ACTIVEUSERS", handleActiveUsers);
    socket.on("GET_FRIEND_REQ", getFrindRequest);
    socket.on("IS_PLAYING", handleIsPlaying);
    return () => {
      socket.off("ACTIVEUSERS", handleActiveUsers);
    };
  }, [socket]);

  // ✅ Remove self from list
  const visibleUsers = getActiveUsers(activeUsers, currentUserName);

  // ✅ Apply search filter
  let filteredUsers = searchInput
    ? visibleUsers.filter((user) =>
        user.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : visibleUsers;


  return (
    <Drawer anchor="left" open={isDrawar} onClose={() => setIsDrawar(false)}>
      <Box
        sx={{
          width: 250,
          backgroundColor: "#24201f",
          height: "100vh", // 🧩 ensure height so scroll is possible
          display: "flex",
          flexDirection: "column",
          // marginTop:"10px",
          p: 2,
          gap: 1,
          overflowY: "auto", // ✅ make it scrollable
          scrollbarWidth: "none", // ✅ Firefox
          "&::-webkit-scrollbar": {
            display: "none", // ✅ Chrome/Safari
          },
        }}
      >
        {/* 🔍 Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1e1e1e",
            borderRadius: "8px",
            // px: 1.5,
            // py: 0.5,
          }}
        >
          <InputBase
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ color: "white", flex: 1, fontSize: "14px" }}
          />
          <IconButton sx={{ color: "white" }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* 👥 Active Users */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map(({ name, avatar, socketId, isPlaying }) => (
            <Box
              key={socketId}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                p: 1.5,
                mb: 1,
              }}
            >
              <Avatar alt={name} src={avatar} />
              <Typography
                sx={{ color: "white", flexGrow: 1, ml: 2, fontWeight: 500 }}
              >
                {name}
              </Typography>
              {!isPlaying ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    textTransform: "none",
                  }}
                  onClick={() => {
                    if (isLoginUserPlaying) {
                      toast.error("You Are In Game");
                      return;
                    }
                    dispatch(setIsPlayerRequested(true))
                    socket.emit("FRIEND_REQUEST", { name, avatar, socketId });
                    toast.success("Request Send");
                  }}
                >
                  Request
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    textTransform: "none",
                    backgroundColor: "seagreen",
                  }}
                  // onClick={() => {
                  //   socket.emit("FRIEND_REQUEST",{name,avatar,socketId})
                  //   toast.success("Request Send")
                  // }}
                >
                  Playing
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "gray", textAlign: "center", mt: 2 }}>
            No users found
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
