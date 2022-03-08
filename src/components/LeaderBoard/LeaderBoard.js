import { Box, Stack } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./LeaderBoard.scss";
import React, { useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    readFireBase("UserList", ``).then((res) => {
      setLeaderBoard(sortByPosition(res ? res : []));
      console.log(res);
    });
  }, []);

  const sortByPosition = (obj) => {
    const order = [];
    let res = {};
    console.log(obj);
    Object.keys(obj).forEach((key) => {
      console.log(obj[key]["scores"].scoreCredit.total);
      return (order[obj[key]["scores"].scoreCredit.total] = key);
    });
    order.forEach((key) => {
      res[key] = obj[key];
    });
    console.log(res);
    return res;
  };

  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      <Stack spacing={2} sx={{ padding: "6px" }}>
        {leaderBoard.map((lb, i) => (
          <div key={i} className="tb-row">
            {console.log(lb)}
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
              {lb.scores.scoreCredit}
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
