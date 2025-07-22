import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useLazyGetMyProfileQuery } from "../api/Api";

const Profile = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [trigger, { data, isLoading, isError }] = useLazyGetMyProfileQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    (async function() {
      const resp = await trigger(1);
      console.log(resp);
    })();
  }, []);
  const [page, setPage] = useState(1);
  if (!data) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          bgcolor: "#1e1e1e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Loading profile...
      </Box>
    );
  }

  const { name, avatar, totalGames, wins, losses, history = [] } = data;

  const filteredHistory = history.filter((match) =>
    match.opponent.toLowerCase().includes(search.toLowerCase())
  );
 console.log(data);
  const hendleGetNextHistory = async() => {
    setPage((prev) => prev + 1);
    trigger(page)
  };
  const hendleGetPrevHistory = async()=>{
    if(page<0) return 
    setPage((prev)=>prev-1)
  }
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bgcolor: "#1e1e1e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        scrollbarWidth: "none",
      }}
    >
      <Box
        sx={{
          width: "100%",
          width: "90%",
          height: "90%",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        <Card
          sx={{
            height: "100%",
            bgcolor: "#1e1e1e",
            color: "white",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
              mt: 2,
            }}
          >
            <Avatar
              alt={name}
              src={avatar}
              sx={{ width: 80, height: 80, border: "2px solid white" }}
            />
            <Box>
              <Typography variant="h5">{name}</Typography>
              <Typography variant="body2" color="gray">
                Multiplayer Tic Tac Toe Player
              </Typography>
            </Box>
            <IconButton sx={{ color: "white" }} onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2} textAlign="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <EmojiEventsIcon fontSize="large" color="success" />
              <Typography variant="h6">{wins}</Typography>
              <Typography variant="body2">Wins</Typography>
            </Grid>
            <Grid item xs={4}>
              <SentimentDissatisfiedIcon fontSize="large" color="error" />
              <Typography variant="h6">{losses}</Typography>
              <Typography variant="body2">Losses</Typography>
            </Grid>
            <Grid item xs={4}>
              <SportsEsportsIcon fontSize="large" color="primary" />
              <Typography variant="h6">{totalGames}</Typography>
              <Typography variant="body2">Games</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ bgcolor: "gray", mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 4,
              mb: 2,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search opponent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                input: { color: "white" },
                bgcolor: "#2b2b2b",
                borderRadius: 1,
                width: "60%",
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray" }} />,
              }}
            />
            <Typography variant="h6">Match History</Typography>
             {
              page!=1?<Button
              variant="contained"
              color="secondary"
              onClick={hendleGetPrevHistory}
            >
              prev
            </Button>:"😆"
             }
            {
              page>=data?.pageInfo?.totalPages?"😔":<Button
              variant="contained"
              color="secondary"
              onClick={hendleGetNextHistory}
            >
              next
            </Button>
            }
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "none" }}>
            <List dense>
              {filteredHistory.length === 0 ? (
                <Typography variant="body2" color="gray">
                  No matches found.
                </Typography>
              ) : (
                filteredHistory.map((match, idx) => (
                  <ListItem
                    key={idx}
                    sx={{ bgcolor: "#2b2b2b", mb: 1, borderRadius: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar src={match.opponentAvatar} alt={match.opponent} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${name} vs ${match.opponent}`}
                      secondary={`Result: ${match.result} | Date: ${match.date}`}
                      secondaryTypographyProps={{ color: "gray" }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
