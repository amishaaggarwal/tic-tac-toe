import { Box, Stack, TableCell, TableRow } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./LeaderBoard.scss";
import React from "react";

function LeaderBoard() {
  const leader = [1, 2, 3];
  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      <Stack spacing={2} sx={{ padding: "6px" }}>
        {leader.map((e, i) => (
          <div key={i} className="tb-row" >
            <Box className="tb-cell">
              <div className="squares">{i + 1}.</div>
            </Box>
            <Box className="tb-cell">
              <div>
                <img
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  width={30}
                />
              </div>
            </Box>
            <Box sx={{ color: "#f0bf00" }} className="tb-cell">
              Amisha Aggarwal
            </Box>
            <Box
              sx={{
                color: "#f0bf00",
              }}
              className="tb-cell"
            >
              36
            </Box>
            <Box className="tb-cell">
              <StarRateIcon sx={{ color: "#f0bf00" }} />
            </Box>
          </div>
        ))}
      </Stack>
    </Box>
  );
}

export default LeaderBoard;
