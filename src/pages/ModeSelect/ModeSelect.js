import { Button, Stack } from "@mui/material";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import UserList from "components/UserList/UserList";
import Notification from "components/Notification/Notification"; 
import { child, onValue, push, ref } from "firebase/database";
import React, {  useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { db, gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import { toast } from "react-toastify";

function ModeSelect() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [acceptRequest, setAcceptRequest] = useState(false);
  const myUser = getSessionStorage("user");
  const [requestId, setRequestId] = useState("");
  const [isRequestRejected, setRequestRejected] = useState(false);



  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      console.log(data.val());
      const request = data.val();
      
      request && Object.values(request).map((invite, i) => {
       
        console.log(invite.requestId);
        if(invite.request_status === 'reject') {
          setRequestRejected(true);  
        }
        if(invite.request_status === 'accept' && (invite.to === myUser || invite.from === myUser)) {
          setAcceptRequest(true);
          setRequestId(invite.requestId);
        }
      });
      console.log(request);
    });
  }, [myUser, requestId]);
  
  useEffect(() => {
    if (acceptRequest) navigate("ok");
    else if (isRequestRejected) {
      toast.error("Your invite rejected !", {
        theme: "dark",
        position: "top-right",
      });
    }
    return () => {
      setAcceptRequest(false);
      setRequestRejected(false);
    };
  }, [acceptRequest, isRequestRejected, navigate, requestId]);


  // useEffect(() => {
    
  // }, [isRequestRejected])
  
  
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
    <>
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
    </>
  );
}

export default ModeSelect;
