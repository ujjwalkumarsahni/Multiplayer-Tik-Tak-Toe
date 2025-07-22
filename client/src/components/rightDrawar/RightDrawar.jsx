import * as React from "react";
import {
  Drawer,
  Box,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { GlobalContext } from "../../context/GlobalContext";
import { getSocket } from "../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { incNewMessageCount } from "../../store/userSlice";

// Emoji picker
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function RightDrawar() {
  const { isRightDrawar, setIsRightDrawar, messages, setMessages } =
    React.useContext(GlobalContext);
  const { socket } = getSocket();
  const { oponentPlayer, userName } = useSelector(
    (state) => state?.loginUser
  );
  const dispatch = useDispatch();
  const inputRef = React.useRef(null);
  const scrollBoxRef = React.useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  // Scroll to top (visually bottom) on new message
  React.useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = 0;
    }
  }, [messages]);

  // Listen only for RECEIVED_MESSAGE
  React.useEffect(() => {
    if (!socket) return;
    const handleReceivedMessage = (data) => {
      setMessages((prev) => [...prev, data?.data]);
      dispatch(incNewMessageCount());
    };

    socket.on("RECEIVED_MESSAGE", handleReceivedMessage);

    return () => {
      socket.off("RECEIVED_MESSAGE", handleReceivedMessage);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!oponentPlayer) {
      toast.error("You Are Not In Game");
      return;
    }
    const value = inputRef.current?.value?.trim();
    if (!value) return;

    const newMessage = {
      sender: userName,
      receiver: oponentPlayer?.name,
      msg: value,
    };

    socket.emit("SEND_MSG", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    inputRef.current.value = "";
  };

  const handleSelectEmoji = (emoji) => {
    const input = inputRef.current;
    const cursorPos = input.selectionStart;
    const text = input.value;
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);
    input.value = before + emoji.native + after;
    input.focus();
    setShowEmojiPicker(false);
  };

  return (
    <Drawer
      anchor="right"
      open={isRightDrawar}
      onClose={() => setIsRightDrawar(false)}
    >
      <Box
        sx={{
          width: 300,
          backgroundColor: "#24201f",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            onClick={() => setIsRightDrawar(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Message Area */}
        <Box
          ref={scrollBoxRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            my: 2,
            px: 1,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {[...messages].reverse().map(({ msg, sender }, index) => (
            <Typography
              key={index}
              sx={{
                color: "white",
                alignSelf: sender === userName ? "flex-end" : "flex-start",
                backgroundColor: sender === userName ? "#1976d2" : "#333",
                p: 1,
                borderRadius: 1,
                maxWidth: "80%",
                textAlign: sender === userName ? "right" : "left",
                wordBreak: "break-word",
              }}
            >
              {msg}
            </Typography>
          ))}
        </Box>

        {/* Emoji Picker and Input */}
        <Box sx={{ position: "relative" }}>
          {showEmojiPicker && (
            <Box sx={{ position: "absolute", bottom: 60, right: 0, zIndex: 1000 }}>
              <Picker data={data} onEmojiSelect={handleSelectEmoji} theme="dark" />
            </Box>
          )}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            inputRef={inputRef}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            InputProps={{
              sx: { backgroundColor: "white", borderRadius: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <IconButton edge="end" color="primary" onClick={handleSendMessage}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
