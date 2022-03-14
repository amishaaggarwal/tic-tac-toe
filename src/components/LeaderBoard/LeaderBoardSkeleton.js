import React from 'react';
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function LeaderBoardSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" />
      <Stack spacing={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={80} height={118} />
      </Stack>
    </Stack>
  );
}

export default LeaderBoardSkeleton