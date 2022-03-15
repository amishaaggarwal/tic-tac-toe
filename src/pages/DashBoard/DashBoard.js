import { Fab, Stack } from "@mui/material";
import GameList from "components/GameList/GameList";
import Header from "components/Header/Header";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";
import "./DashBoard.scss";
import UserList from "components/UserList/UserList";

function DashBoard() {
    const fabStyle = {
      position: "absolute",
      bottom: 16,
      right: 16,
    };
  return (
    <Stack spacing={1} className="dashboard">
      <Header />
      <div direction="row" spacing={2} className="center-body">
        <UserList/>
        <GameList />
        <LeaderBoard />
      </div>
      <Fab color="secondary" aria-label="mail" sx={fabStyle}>
        <MailIcon />
      </Fab>
    </Stack>
  );
}

export default DashBoard;
