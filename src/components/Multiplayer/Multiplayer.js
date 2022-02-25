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
import { onValue, ref, update } from "firebase/database";

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
  const [emptyBlocks, setEmptyBlocks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [wins, setWins] = useState("");
  const [count, setCount] = useState(x);
  const [confetti, setConfetti] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [myMove, setMyMove] = useState(0);
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
  }, [newKey]);

  //-function for updating firebase data
  const updateFireBase = useCallback(
    (keys, value) => {
      switch (keys) {
        case "gamestate":
          update(ref(db, `Game/${newKey}`), { gamestate: value });
          break;
        case "current":
          update(ref(db, `Game/${newKey}`), { current: value });
          break;
        case "players":
          update(ref(db, `Game/${newKey}`), { players: value });
          break;
        case "moveNow":
          update(ref(db, `Game/${newKey}`), { moveNow: value });
          break;
        case "lastMove":
          update(ref(db, `Game/${newKey}`), { lastMove: value });
          break;
        case "winner":
          update(ref(db, `Game/${newKey}`), { winner: value });
          break;
        default:
          break;
      }
    },
    [newKey]
  );

  //-for cases when time runs out,selects an empty cell from grid
  const computerPlay = (empty) => {
    let i = Math.ceil(Math.random() * (empty.length - 1));
    return empty[i];
  };

  //-checks if we have a winner by searching for winning conditions in the current grid
  const checkWinner = useCallback(
    (mygrid) => {
      for (let i = 0; i < winingState.length; i++) {
        const [a, b, c] = winingState[i];
        if (mygrid[a] && mygrid[a] === mygrid[b] && mygrid[a] === mygrid[c]) {
          won = mygrid[a];
          updateFireBase("winner", won);
          break;
        }
      }
      // x = currentState.filter(checkEmpty).length;
      // setCount(x);
    },
    [updateFireBase]
  );

  const showWinner = useCallback(() => {
    if (wins !== "") {
      if (
        myUser !== (wins === CROSS ? users.player1.email : users.player2.email)
      ) {
        openDrawModal();
      } else {
        setConfetti(true);
        openModal();
      }
    } else if (count === 0) {
      openDrawModal();
    }
  }, [
    count,
    myUser,
    users.player1.email,
    wins,
    users.player2.email,
  ]);

  //-checks if the grid cell is empty
  const checkEmpty = (x) => {
    return x === "";
  };

  //-updates firebase states when move happens
  const playMove = useCallback(
    (index) => {
      let mygrid = [...currentState];
      mygrid[index] = moveNow;
      setMyMove(1);
      // setCurrentState(mygrid);
      let lastMove = {
        id: moveNow === CROSS ? users.player1.email : users.player2.email,
        position: index,
      };
      let turn = moveNow === CROSS ? ZERO : CROSS;
      // setMoveNow(turn);
      // setCount(x);
      checkWinner(mygrid);
      updateFireBase("gamestate", mygrid);
      updateFireBase("current", turn);
      updateFireBase("lastMove", lastMove);
    },
    [
      moveNow,
      currentState,
      updateFireBase,
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
    setMyMove(0);
    const empty = currentState
      .map((square, index) => (square === "" ? index : null))
      .filter((val) => val !== null);
    setEmptyBlocks(empty);
    x = currentState.filter(checkEmpty).length;
    showWinner();
  }, [currentState, showWinner]);

  //   const AutoPlay = useCallback(() => {
  //     if (won === "" && emptyBlocks.length > 0 && myMove === 0) {
  //       playMove(computerPlay(emptyBlocks));
  //     }
  //   }, [emptyBlocks, myMove, playMove]);

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       AutoPlay();
  //     }, 30000);
  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }, [AutoPlay, wins]);

  //-resets all gamestates in firebase
  const resetGame = () => {
    // setCurrentState(initialState);
    // x = initialState.length;
    // setCount(9);
    // setMoveNow(CROSS);
    // setWins("");
    updateFireBase("winner", "");
    updateFireBase("current", CROSS);
    updateFireBase("gamestate", initialState);
    updateFireBase("lastMove", { id: "", position: -1 });
    setMyMove(0);
    // setEmptyBlocks([0, 1, 2, 3, 4, 5, 6, 7, 8]);
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
        {/* {console.log(play.state.winner, wins)} */}
        <DrawScreen msg={wins === "" && count === 9 ? DRAW : LOST} />
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
