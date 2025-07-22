import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
    credentials: "include", // Ensures cookies are sent with every request
  }),
  tagTypes: ["logout"],
  endpoints: (builder) => ({
    // 🟢 Sign Up User
    signUpUser: builder.mutation({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
      }),
    }),

    // 🟢 Login User
    loginUser: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
    }),

    // 🟢 Direct Login (used to auto-login if token exists)
    directLogin: builder.query({
      query: () => ({
        url: "direct-login",
        method: "GET",
      }),
      providesTags: ["logout"],
      keepUnusedDataFor: 0, // No caching
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }),

    // 🟢 Search User by name
    searchUser: builder.query({
      query: (name) => ({
        url: `search/${name}`,
        method: "GET",
      }),
    }),
    // 🟢 Get paginated profile data
    getMyProfile: builder.query({
      query: (page) => ({
        url: `getprofile?page=${page}`,
        method: "GET",
      }),
    }),

    // 🔴 Logout User (clears cookie/session)
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["logout"],
    }),
  }),
});

// ✅ Export Hooks for Components
export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useDirectLoginQuery,
  useLazySearchUserQuery,
  useLazyGetMyProfileQuery,
  useLogoutUserMutation,
} = apiSlice;

// ✅ Export Reducer for Store Setup
export const userRed = apiSlice.reducer;
