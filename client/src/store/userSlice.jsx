import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user
const initialState = {
  userName: "",                  // Logged in user's name
  avatar: "",                   // Avatar image URL
  token: "",                    // Auth token
  friendRequest: [],            // Incoming friend requests
  isPlaying: false,             // Playing state
  oponentPlayer: "",           // Current opponent info
  newMessageCount: 0,          // Unread message count
  isPlayerRequested: false,    // Friend request sent flag
  currentPlayingUsers: [],     // List of current active game players
  isLogout: false              // Logout trigger (used for side effects)
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Set login user details
    setLoginUser: (state, action) => {
      state.userName = action.payload?.name || "";
      state.avatar = action.payload?.avatar || "";
      state.isLogout = false; // Reset logout state if re-logging in
    },

    // ✅ Set token
    setToken: (state, action) => {
      state.token = action.payload?.token || "";
    },

    // ✅ Push new friend request (if not already in list)
    setFriendRequest: (state, action) => {
      const exists = state.friendRequest.some(
        (item) => item.name === action.payload.name
      );
      if (!exists) {
        state.friendRequest.push(action.payload);
      }
    },

    // ✅ Clear friend request list
    setFriendReqEmpty: (state) => {
      state.friendRequest = [];
    },

    // ✅ Set playing state
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    // ✅ Set opponent data
    setOponentPlayer: (state, action) => {
      state.oponentPlayer = action.payload;
    },

    // ✅ Increase message count by 1
    incNewMessageCount: (state) => {
      state.newMessageCount += 1;
    },

    // ✅ Reset message count
    setNewMessageCountZero: (state) => {
      state.newMessageCount = 0;
    },

    // ✅ Set friend request sent state
    setIsPlayerRequested: (state, action) => {
      state.isPlayerRequested = action.payload;
    },

    // ✅ Set the list of currently playing users
    setCurrentPlayingUser: (state, action) => {
      state.currentPlayingUsers = action.payload;
    },

    // ✅ Trigger logout — reset user info
    logoutUserSlice: (state) => {
      state.userName = "";
      state.avatar = "";
      state.token = "";
      state.friendRequest = [];
      state.isPlaying = false;
      state.oponentPlayer = "";
      state.newMessageCount = 0;
      state.isPlayerRequested = false;
      state.currentPlayingUsers = [];
      state.isLogout = true;
    },

    // ✅ Explicitly set logout trigger
    setIsLogout: (state, action) => {
      state.isLogout = action.payload;
    }
  },
});

// Export actions
export const {
  setLoginUser,
  setToken,
  setFriendRequest,
  setFriendReqEmpty,
  setIsPlaying,
  setOponentPlayer,
  incNewMessageCount,
  setNewMessageCountZero,
  setIsPlayerRequested,
  setCurrentPlayingUser,
  logoutUserSlice,
  setIsLogout,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
