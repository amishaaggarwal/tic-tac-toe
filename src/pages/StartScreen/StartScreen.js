import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import { onValue, update } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { provider, auth, db } from "utils/firebaseSetup/FirebaseSetup";
import { ref } from "firebase/database";
import "./StartScreen.scss";
import { toast } from "react-toastify";
import { Modal, Stack } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { setSessionStorage } from "utils/Storage/SessionStorage";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";

let data = {
  players: {
    player1: {
      name: "",
      email: "",
    },
    player2: {
      name: "",
      email: "",
    },
  },
  gamestate: ["", "", "", "", "", "", "", "", ""],
  lastMove: {
    position: -1,
    id: "",
  },
  current: "X",
  winner: "",
};

function StartScreen() {
  const navigate = useNavigate();
  const { newKey } = useParams();
  const [initData, setInitData] = useState(data);
  const [modalIsOpen, setIsOpen] = useState(false);

  //-gets firebase values and sets states
  useEffect(() => {
    onValue(ref(db, `Game/${newKey}`), (snapshot) => {
      const fbdata = snapshot.val();
      data.players = fbdata.players;
      setInitData(data);
    });
    return () => {
      setInitData(data);
    };
  }, [newKey]);

  //-sign in function
  const signIn = (e) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        //-user data set to firebase
        updateFireBase("UserList", user.email, "name", user.displayName);
        updateFireBase("UserList", user.email, "email", user.email);
        updateFireBase("UserList", user.email, "dp", user.photoURL);

        //-checks if player 1 is already set
        if (data.players.player1.name === "") {
          setSessionStorage(user.email);
          data.players.player1.name = user.displayName.split(" ")[0];
          data.players.player1.email = user.email;
          setInitData(data);
          openModal();
        } else if (data.players.player1.email !== user.email) {
          setSessionStorage(user.email);
          data.players.player2.name = user.displayName.split(" ")[0];
          data.players.player2.email = user.email;
          setInitData(data);
          navigate(`/tic-tac-toe/${newKey}`, { state: data });
        }
        const updates = {};
        updates[newKey] = data;
        update(gameListRef, updates);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        // The email of the user's account used.
        const errorMessage = error.message;
        toast.error(`${errorCode}:${errorMessage}`);
      });
  };

  //-copy link modal opens up
  const openModal = () => {
    setIsOpen(true);
  };

  //-copy link modal closes
  const closeModal = () => {
    setIsOpen(false);
    navigate(`/tic-tac-toe/${newKey}`, { state: { ...initData } });
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ backgroundColor: "aqua", color: "black" }}
        type="submit"
        onClick={signIn}
      >
        Sign-In with Google!
      </Button>
      <Modal open={modalIsOpen} onClose={closeModal} className="winning-modal">
        <Stack spacing={3}>
          <div>Share link below with your friend!</div>
          <Stack direction="row" spacing={2} className="button-row">
            <CopyToClipboard text={window.location.href}>
              <button>Copy Link!</button>
            </CopyToClipboard>
            <Button onClick={closeModal}>Lets Play!</Button>
          </Stack>
        </Stack>
      </Modal>
    </div>
  );
}

export default StartScreen;
