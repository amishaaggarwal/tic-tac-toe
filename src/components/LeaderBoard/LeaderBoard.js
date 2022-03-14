import { Box, Stack } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./LeaderBoard.scss";
import React, { useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";
import LeaderBoardSkeleton from "./LeaderBoardSkeleton";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  
  useEffect(() => {
    readFireBase("UserList", ``).then((res) => {
      setLeaderBoard(sortByPosition(res ? res : []));
    });
  }, []);

  const sortByPosition = (obj) => {
    const order = [];
    let res = [];

    if (Object.keys(obj).length > 0) {
      Object.keys(obj).forEach((key) => {
        res.push([key, obj[key]["totalScores"]]);
      });
      res.sort(function (a, b) {
        return b[1] - a[1];
      });

      res.forEach((key) => {
        order.push(obj[key[0]]);
      });

      return order;
    }
  };

  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      {leaderBoard?<Stack spacing={2} sx={{ padding: "6px" }}>
        {leaderBoard.map((lb, i) => (
          <div key={i} className="tb-row">
            <Box className="tb-cell">
              <div className="squares">{i + 1}.</div>
            </Box>
            <Box className="tb-cell">
              <div>
                <img src={lb.dp} alt="display" width={30} />
              </div>
            </Box>
            <Box sx={{ color: "#f0bf00" }} className="tb-cell">
              {lb.name}
            </Box>
            <Box
              sx={{
                color: "#f0bf00",
              }}
              className="tb-cell"
            >
              {lb.totalScore}
            </Box>
            <Box className="tb-cell">
              <StarRateIcon sx={{ color: "#f0bf00" }} />
            </Box>
          </div>
        ))}
      </Stack>:<LeaderBoardSkeleton/>}
    </Box>
  );
}

export default LeaderBoard;
