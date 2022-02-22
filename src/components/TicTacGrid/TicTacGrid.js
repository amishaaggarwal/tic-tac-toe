import Squares from "components/Squares/Squares";
import WinningScreen from "components/WinningScreen/WinningScreen";
import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { useSelector } from "react-redux";
import "./TicTacGrid.scss";
import { Navigate } from "react-router-dom";
import { CROSS, ZERO } from "constants/game-constants";
import { CELL_OCCUPIED, DRAW } from "constants/notification-constants";
import { Stack ,Button} from "@mui/material";


const initialState = ["", "", "", "", "", "", "", "", ""];
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
let won = "", x = 0;
Modal.setAppElement("#root");
function TicTacGrid() {
  const [emptyBlocks, setEmptyBlocks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [currentState, setCurrentState] = useState(initialState);
  const [moveNow, setMoveNow] = useState(CROSS);
  const [wins, setWins] = useState("");
  const [count, setCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const play = useSelector((state) => state.user.players);


  const computerPlay = (empty) => {
    let i = Math.ceil(Math.random() * (empty.length - 1));
    return empty[i];
  }

  const checkWinner = useCallback((mygrid) => {
    console.log(mygrid);
    for (let i = 0; i < winingState.length; i++) {
      const [a, b, c] = winingState[i];
      if (mygrid[a] && mygrid[a] === mygrid[b] && mygrid[a] === mygrid[c]) {
        won = mygrid[a];
        setWins(won);
        break;
      }
    }
    if (won !== "") {
      console.log(won);
      setConfetti(true);
      openModal();
      // resetGame();
    } else if (x === 9) {
      toast.warning(DRAW);
      // resetGame();
    }
  }, []);

  const playMove = useCallback((index) => {
    let mygrid = [...currentState];
    mygrid[index] = moveNow;
    checkWinner(mygrid);
    setCurrentState(mygrid);
    setMoveNow(moveNow === CROSS ? ZERO : CROSS);
    x = count;
    ++x;
    setCount(x);

  }, [moveNow, count, checkWinner, currentState]);

  const squareClick = (index) => {
    if (currentState[index] !== "") {
      toast.error(CELL_OCCUPIED, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "dark-toast",
      });
    } else if (wins === "") {
      console.log(wins)
      playMove(index)
    }
  };
  useEffect(() => {
    const empty = currentState.map((square, index) => square === "" ? index : null).filter(val => val !== null);
    console.log(empty, 1);
    setEmptyBlocks(empty);
  }, [currentState])

  const ZeroPlay = useCallback(() => {
    if (won === "" && emptyBlocks.length > 0 && moveNow === ZERO) {
      playMove(computerPlay(emptyBlocks))
    }
  }, [emptyBlocks, moveNow, playMove]);

  useEffect(() => {
    console.log("2")
    const timeout = setTimeout(
      () => {
        ZeroPlay();
      },
      1000
    );
    return () => {
      clearTimeout(timeout);
    };

  }, [ZeroPlay, wins]);


  const resetGame = () => {
    setCurrentState(initialState);
    x = 0;
    setCount(x);
    setMoveNow(CROSS);
    won = "";
    setWins(won);
    setEmptyBlocks([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setConfetti(false);
    setIsOpen(false);
  };

  const playAgain = () => {
    closeModal();
    resetGame();
  }

  return play.players ? (<div>
    <div>
      <span className="move-text">
        {moveNow === CROSS
          ? play.players.player1.name
          : play.players.player2.name}
        , Your Move!
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
      <WinningScreen
        winnerIs={won}
      />
      <Stack direction="row" spacing={2}>
        <Button onClick={closeModal} className="rst-button" sx={{color:"black"}}>
          Close
        </Button>
        <Button onClick={playAgain} className="rst-button" sx={{ color: "black" }}>
          Play Again
        </Button>
      </Stack>
    </Modal>
    {confetti && <Confetti />}
  </div>) : (<Navigate to="/" />)
}

export default TicTacGrid;
