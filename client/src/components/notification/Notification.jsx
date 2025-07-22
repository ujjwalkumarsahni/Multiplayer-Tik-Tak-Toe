import * as React from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { GlobalContext } from "../../context/GlobalContext";
import { color } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../context/SocketProvider";
import { setFriendReqEmpty, setFriendRequest } from "../../store/userSlice";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  maxHeight: 500,
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  color: "white",
  backgroundColor: "#1a1716",
  p: 3,
};

export default function Notification() {
  const { isNotification, setIsNotification } = React.useContext(GlobalContext);
  const { userName, avatar, friendRequest, currentPlayingUsers } = useSelector(
    (state) => state.loginUser
  );
  
  const { socket } = getSocket();
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsNotification(false);
  };

  const handleAccept = (friend) => {
    socket.emit("ACCEPT_FRIEND_REQUEST", {
      you: { name: userName, avatar },
      oponent: friend,
    });
    setIsNotification(false);
    dispatch(setFriendReqEmpty());
  };

  const handleReject = (name) => {
    console.log(`Rejected ${name}`);
  };
  // console.log(friendRequest);
  return (
    <Modal
      aria-labelledby="notification-modal-title"
      aria-describedby="notification-modal-description"
      open={isNotification}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
      //   sx={{backgroundColor:"'#24201f'"}}
    >
      <Fade in={isNotification}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Friend Requests
          </Typography>

          {friendRequest?.map((user, index) => (
            <Box key={user._id}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar alt={user?.name} src={user?.avatar} />
                  <Typography>{user?.name}</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  {currentPlayingUsers?.includes(user?._id) ? (
                    <Button
                      variant="contained"
                      color="error"
                    >
                      Playing
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(user)}
                    >
                      Accept
                    </Button>
                  )}

                  {/* <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleReject(user?.name)}
                  >
                    Reject
                  </Button> */}
                </Stack>
              </Stack>
              {index < friendRequest?.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Fade>
    </Modal>
  );
}
