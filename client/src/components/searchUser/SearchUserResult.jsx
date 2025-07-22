import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { GlobalContext } from "../../context/GlobalContext";
import { Avatar, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLazySearchUserQuery } from "../../api/Api";
import { useSelector } from "react-redux";
import { useContext } from "react";

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export default function SearchUserResult() {
  const [open, setOpen] = React.useState(false);
  const { isSearchUser, setIsSearchUser } = React.useContext(GlobalContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const { searchUserName } = React.useContext(GlobalContext);
  const searchQuery = useSelector(
    (state) => state.api.queries[`searchUser("${searchUserName}")`]
  );

  

  const handleClose = () => {
    setIsSearchUser(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isSearchUser}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        sx={{ width: "100%" }}
      >
        {
          searchQuery?.data?.friends?.map(({avatar,name})=><DialogTitle
            style={{
              cursor: "move",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "300px",
            }}
            id="draggable-dialog-title"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar src={avatar} />
              <span>{name
                }</span>
            </div>
            <IconButton>
              <AddIcon />
            </IconButton>
          </DialogTitle>)
        }
      </Dialog>
    </React.Fragment>
  );
}
