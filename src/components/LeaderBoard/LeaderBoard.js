import { Box, Stack } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./LeaderBoard.scss";
import React, { useCallback, useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";
import pingPong from "../../constants/game-logos/ping-pong.jpeg";
import ticTac from "../../constants/game-logos/tic-tac.ico";
import LeaderBoardSkeleton from "./LeaderBoardSkeleton";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [isGameLevel, setIsGameLevel] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [logos, setLogos] = useState({
    "ping-pong": pingPong,
    "tic-tac": ticTac,
  });

  const identifyLevel = useCallback(
    (obj) => {
      const order = [];
      let res = [];

      let loc = window.location.hostname;

      if (Object.keys(obj).length > 0 && loc.search("dashboard") !== -1) {
        Object.keys(obj).forEach((row, key) => {
          let games = {};
          Object.values(obj[row]["gameID"]).map((u) => {
            Object.values(u).map((o) => {
              let data = {};
              if (o.status === "won") {
                games[o.game] = {};
                data["total"] = games[o.game].total
                  ? games[o.game].total + 1
                  : 1;
                data["gname"] = o.game;
                data["logo"] = logos[o.game];
                games[o.game] = data;
              }
            });
          });
          res.push([row, obj[row]["totalScore"], games]);
        });
      } else if (
        Object.keys(obj).length > 0 &&
        loc.search("dashboard") === -1
      ) {
        Object.keys(obj).forEach((row, key) => {
          let gameScore = 0,
            total = 0;
          Object.values(obj[row]["gameID"]).map((u) => {
            Object.values(u).map((o) => {
              total += "tic-tac" === o.game && o.status === "won" ? 1 : 0;
            });
          });
          gameScore = total * 50;
          setIsGameLevel(true);
          res.push([row, gameScore, total]);
        });
      }

      res.sort(function (a, b) {
        return b[1] - a[1];
      });
      loc.search("dashboard") === -1
        ? res.forEach((key) => {
            obj[key[0]].totalScore = key[1];
            obj[key[0]].total_games = key[2];
            order.push(obj[key[0]]);
          })
        : res.forEach((key) => {
            console.log(Object.values(key[2]));
            obj[key[0]].games_played = Object.values(key[2]);
            order.push(obj[key[0]]);
          });

      return order;
    },
    [logos]
  );

  useEffect(() => {
    readFireBase("UserList", ``).then((res) => {
      setLeaderBoard(res ? identifyLevel(res) : []);
    });
  }, [identifyLevel]);

  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      {leaderBoard ? (
        <Stack spacing={2} sx={{ padding: "6px" }}>
          {leaderBoard.map((lb, i) => (
            <Stack spacing={1} direction="row" key={i}>
              <div
                key={i}
                className="tb-row"
                onMouseOver={() => {
                  setHidden(false);
                }}
                onMouseOut={() => {
                  setHidden(true);
                }}
              >
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
              <div className={hidden ? "hide" : "show"}>
                <div>
                  {lb.games_played && (
                    <span>
                      <div>Games Played:</div>
                      {lb.games_played.map((row, i) => (
                        <Stack direction="row" spacing={1} key={i}>
                          <img src={row.logo} width={30} alt={row.gname} />
                          <span>{row.total}</span>
                        </Stack>
                      ))}
                    </span>
                  )}
                </div>
                <div>Total Games Played:{lb.total_games}</div>
              </div>
            </Stack>
          ))}
        </Stack>
      ) : (
        <LeaderBoardSkeleton />
      )}
    </Box>
  );
}

export default LeaderBoard;
