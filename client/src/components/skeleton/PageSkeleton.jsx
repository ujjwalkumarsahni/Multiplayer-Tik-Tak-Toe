import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const PageSkeleton = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        height: "100vh",
        overflow: "auto",
        color: "white",
        p: 2,
      }}
    >
      {/* Header Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, bgcolor: "#333" }} />

      {/* Board Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, bgcolor: "#444" }} />

      {/* SearchUserResult */}
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2, bgcolor: "#444" }} />

      <Stack direction="row" spacing={2}>
        {/* LeftDrawra */}
        <Skeleton variant="rectangular" width={200} height={400} sx={{ bgcolor: "#444" }} />

        {/* Chat Panel (RightDrawar) */}
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ bgcolor: "#444" }} />
      </Stack>

      {/* Notification */}
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2, bgcolor: "#444" }} />
    </Box>
  );
};

export default PageSkeleton;
