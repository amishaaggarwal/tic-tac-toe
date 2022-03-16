import { Button, Stack } from "@mui/material";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import UserList from "components/UserList/UserList";
import { child, push } from "firebase/database";
import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";

function ModeSelect() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  //-selects mode
  const changeMode = (mymode) => {
    switch (mymode) {
      case "single":
        navigate("/tic-tac-toe-single-player");
        break;
      case "multi":
        const newKey = push(child(gameListRef, "GameSession")).key;
        let key = newKey.substring(1);
        openModal();
        // navigate(`/${key}`);
        break;
      default:
        navigate("/");
    }
  };

  //-opens lost modal
  const openModal = () => {
    setOpen(true);
  };

  //-closes lose modal
  const closeModal = () => {
    setOpen(false);
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

      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <UserList />
      </Modal>
    </Stack>
  );
}

export default ModeSelect;
