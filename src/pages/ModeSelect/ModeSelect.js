import { Button, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import { push,child, } from "firebase/database";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";

function ModeSelect() {
  const navigate = useNavigate();

  //-selects mode
  const changeMode = (mymode) => {
    switch (mymode) {
      case "single":
        navigate("/tic-tac-toe-single-player");
        break;
      case "multi":
        const newKey = push(child(gameListRef, "Game")).key;
        let key = newKey.substring(1)
        navigate(`/${key}`);
        break;
      default:
        navigate("/");
    }
  };
  
  return (
    <Stack direction="row" spacing={4}>
      <Stack sx={{ backgroundColor: "#C0C0C0", padding: "60px" }} spacing={2}>
        <h1>Select Mode</h1>
        <Button onClick={() => changeMode("single")} variant="contained">
          Single Player
        </Button>
        <Button onClick={() => changeMode("multi")} variant="contained">
          Multi Player
        </Button>
      </Stack>
      <LeaderBoard />
    </Stack>
  );
}

export default ModeSelect;
