import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNewMessageCountZero } from "../../store/userSlice";
import { toast } from "react-toastify";
import { useLogoutUserMutation } from "../../api/Api";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isPlaying} = useSelector((state)=>state.loginUser)

  const {
    isDrawar,
    setIsDrawar,
    isRightDrawar,
    setIsRightDrawar,
    isNotification,
    setIsNotification,
  } = React.useContext(GlobalContext);

  const { name, avatar, friendRequest, newMessageCount,currentPlayingUser} = useSelector(
    (state) => state.loginUser
  );
  const [logoutUser,data] = useLogoutUserMutation()
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async()=>{
    const resp =await logoutUser()
    if(resp?.data?.success){
      toast.error("User Logout")
      navigate("/")
    }
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          if(!isPlaying) navigate("/profile");
          else toast.error("you are in the game")
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          if(!isPlaying) handleLogout();
          else toast.error("you are in the game")
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1a1716" }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon onClick={() => setIsDrawar(!isDrawar)} />
          </IconButton>

          <Typography variant="h6" noWrap>
            Let's Play
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification & Message Icons */}
          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              setIsRightDrawar(!isRightDrawar);
              dispatch(setNewMessageCountZero());
            }}
          >
            <Badge badgeContent={newMessageCount} color="error">
              <MailIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            onClick={() => setIsNotification(!isNotification)}
          >
            <Badge badgeContent={currentPlayingUser?.length == 0 ? 0 :friendRequest?.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar alt={name} src={avatar} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {renderMenu}
    </Box>
  );
}
