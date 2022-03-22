import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";




function Notification() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const myUser = getSessionStorage('user');
  const [requestId, setRequestId] = useState('');
  const [sender, setSender] = useState('');
  const [game, setGame] = useState('');


  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      console.log(data.val());
      const request = data.val();
      
      request && Object.values(request).map((invite, i) => {
       
        console.log(invite.requestId);
        if(invite.to === myUser && invite.request_status === 'pending') {
          console.log(invite.requestId);
            setOpen(true);
            setGame(invite.game);
            setSender(invite.from);
            setRequestId(invite.requestId);
            console.log('d')
        }

      });
    console.log(request);
    });
  }, [myUser, requestId]);

    useEffect(() => {
        const timeout = setTimeout(() => {
          setOpen(false);
          if(requestId) {
            updateFireBase("Invites", requestId, "request_status", "expire");
            updateFireBase("Invites", requestId, "to", "");
          }
        }, 60000);
        return () => {
            clearTimeout(timeout);
        };
    }, [open, requestId]);

  const acceptRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "accept");
    navigate('/ok');
    setOpen(false);
  };

  const rejectRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "reject");
    updateFireBase("Invites", requestId, "to", "");
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button variant="contained" onClick={() => rejectRequest()}>
        Reject
      </Button>
      <Button variant="contained" onClick={() => acceptRequest()}>
        Accept
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
      >
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
    
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={`${sender} invites you for ${game}`}
        action={action}
      />
    </>
  );
}

export default Notification;
