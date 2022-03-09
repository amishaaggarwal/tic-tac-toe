import Squares from "components/Squares/Squares";
import WinningScreen from "components/WinningScreen/WinningScreen";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { CROSS, ZERO } from "constants/game-constants";
import {
  CELL_OCCUPIED,
  DRAW,
  LOST,
  NOT_YOUR_TURN,
} from "constants/notification-constants";
import { Stack, Button } from "@mui/material";
import DrawScreen from "components/DrawScreen/DrawScreen";
import { useLocation, useParams } from "react-router-dom";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { onValue, ref } from "firebase/database";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
//-empty grid
const initialState = ["", "", "", "", "", "", "", "", ""];

//-winning conditions for 3x3 grid
const winingState = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

//-won variable updates the wins state and x updates the count state
let won = "",
  x = initialState.length;

Modal.setAppElement("#root");
function Multiplayer() {
  const [wins, setWins] = useState("");
  const [count, setCount] = useState(x);
  const [confetti, setConfetti] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [drawModalIsOpen, setDrawIsOpen] = useState(false);
  const myUser = JSON.parse(getSessionStorage());
  const { newKey } = useParams();
  const play = useLocation();
  let mydata = play.state;
  const [users, setUsers] = useState(mydata.players);
  const [currentState, setCurrentState] = useState(mydata.gamestate);
  const [moveNow, setMoveNow] = useState(mydata.moveNow);

  //-updates all states on value change in firebase
  useEffect(() => {
    onValue(ref(db, `Game/${newKey}`), (snapshot) => {
      const data = snapshot.val();
      setCurrentState(data.gamestate);
      setMoveNow(data.current);
      setWins(data.winner);
      setUsers(data.players);
      setCount(data.gamestate.filter(checkEmpty).length);
    });

    //cleanup function
    return () => {
      setCurrentState(initialState);
      setMoveNow(CROSS);
      setWins("");
      setUsers("");
      setCount(9);
    }
  }, [newKey]);

  //-checks if we have a winner by searching for winning conditions in the current grid
  const checkWinner = useCallback(
    (mygrid) => {
      for (let i = 0; i < winingState.length; i++) {
        const [a, b, c] = winingState[i];
        if (mygrid[a] && mygrid[a] === mygrid[b] && mygrid[a] === mygrid[c]) {
          won = mygrid[a];
          updateFireBase("Game", newKey, "winner", won);
          updateFireBase("UserList", users.player1.email, "total", 1);
          updateFireBase("UserList", users.player2.email, "total", 1);
          break;
        }
      }
    },
    [newKey, users.player1.email, users.player2.email]
  );

  //-opens appropriate modal if we have winner,loser or draw
  const showWinner = useCallback(() => {
    if (wins !== "") {
      if (
        myUser !== (wins === CROSS ? users.player1.email : users.player2.email)
      ) {
        openDrawModal();
        updateFireBase("UserList", myUser, "scoreCredit", 0);
        updateFireBase("UserList", myUser, "gameID", {
          status: "lost",
          gameid: newKey,
        });
      } else {
        setConfetti(true);
        openModal();
        updateFireBase("UserList", myUser, "scoreCredit", 50);
        updateFireBase("UserList", myUser, "gameID", {
          status: "won",
          gameid: newKey,
        });
      }
    } else if (count === 0) {
      openDrawModal();
      updateFireBase("UserList", myUser, "scoreCredit", 0);
      updateFireBase("UserList", myUser, "gameID", {
        status: "draw",
        gameid: newKey,
      });
    }
  }, [wins, count, myUser, users.player1.email, users.player2.email, newKey]);

  //-checks if the grid cell is empty
  const checkEmpty = (x) => {
    return x === "";
  };

  //-updates firebase states when move happens
  const playMove = useCallback(
    (index) => {
      let mygrid = [...currentState];
      mygrid[index] = moveNow;
      let lastMove = {
        id: moveNow === CROSS ? users.player1.email : users.player2.email,
        position: index,
      };
      let turn = moveNow === CROSS ? ZERO : CROSS;
      checkWinner(mygrid);
      updateFireBase("Game", newKey, "gamestate", mygrid);
      updateFireBase("Game", newKey, "current", turn);
      updateFireBase("Game", newKey, "lastMove", lastMove);
    },
    [
      moveNow,
      currentState,
      newKey,
      checkWinner,
      users.player2.email,
      users.player1.email,
    ]
  );

  //-handles click of user
  const squareClick = (index) => {
    if (currentState[index] !== "") {
      toast.error(CELL_OCCUPIED, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "dark-toast",
      });
    } else if (
      myUser !== (moveNow === CROSS ? users.player1.email : users.player2.email)
    ) {
      toast.error(NOT_YOUR_TURN, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "dark-toast",
      });
    } else if (wins === "") {
      playMove(index);
    }
  };

  //-runs on every change to currentState ,updates emptyBlocks,currentMove and checksWinner
  useEffect(() => {
    x = currentState.filter(checkEmpty).length;
    showWinner();
  }, [currentState, showWinner]);

  //-resets all gamestates in firebase
  const resetGame = () => {
    updateFireBase("Game", newKey, "winner", "");
    updateFireBase("Game", newKey, "current", CROSS);
    updateFireBase("Game", newKey, "gamestate", initialState);
    updateFireBase("Game", newKey, "lastMove", { id: "", position: -1 });
  };

  //-opens winner modal
  const openModal = () => {
    setIsOpen(true);
  };

  //-closes winner modal
  const closeModal = () => {
    setConfetti(false);
    setIsOpen(false);
  };

  //-opens draw n lost modal
  const openDrawModal = () => {
    setDrawIsOpen(true);
  };

  //-closes draw n lose modal
  const closeDrawModal = () => {
    setDrawIsOpen(false);
  };

  //-closes modals and resets gamestates on firebase
  const playAgain = () => {
    resetGame();
    closeModal();
    closeDrawModal();
  };

  return (
    <div>
      <div>
        <span className="move-text">
          {moveNow === CROSS ? users.player1.name : users.player2.name}, Your
          Move!
        </span>
      </div>
      <div className="tic-tac-grid">
        <div className="tic-tac-row ">
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[0]}
            i={0}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[1]}
            i={1}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom"
            mystate={currentState[2]}
            i={2}
            task={squareClick}
          />
        </div>
        <div className="tic-tac-row">
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[3]}
            i={3}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[4]}
            i={4}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom"
            mystate={currentState[5]}
            i={5}
            task={squareClick}
          />
        </div>
        <div className="tic-tac-row">
          <Squares
            mystyle="b-right"
            mystate={currentState[6]}
            i={6}
            task={squareClick}
          />
          <Squares
            mystyle="b-right"
            mystate={currentState[7]}
            i={7}
            task={squareClick}
          />
          <Squares mystate={currentState[8]} i={8} task={squareClick} />
        </div>
        {(!users.player1.name || !users.player2.name) && (
          <div className="move-text">Waiting for opponent...</div>
        )}
        <button onClick={resetGame} className="rst-button">
          Reset Game
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <WinningScreen winnerIs={won} multi={play.state.players} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeModal}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Close
          </Button>
          <Button
            onClick={playAgain}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Play Again
          </Button>
        </Stack>
      </Modal>
      <Modal
        isOpen={drawModalIsOpen}
        onRequestClose={closeDrawModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <DrawScreen msg={wins === "" && count === 0 ? DRAW : LOST} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeDrawModal}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Close
          </Button>
          <Button
            onClick={playAgain}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Play Again!
          </Button>
        </Stack>
      </Modal>
      {confetti && <Confetti />}
    </div>
  );
}

export default Multiplayer;
