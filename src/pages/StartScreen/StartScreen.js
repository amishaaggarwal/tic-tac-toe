import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./StartScreen.scss";
import { setPlayers } from "redux/loginredux/LoginActions";

const data = {
  players: {
    player1: {
      name: "",
      ip: "",
    },
    player2: {
      name: "Computer",
      ip: "",
    },
  },
  gamestate: ["", "", "", "", "", "", "", "", ""],
  current: "",
  scores: [0, 0],
};
function StartScreen() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    player1: "player1",
    player2: "Computer",
  });
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    data.players.player1.name = player.player1;
    data.players.player2.name = player.player2;
    dispatch(setPlayers(data));
    navigate("/mode");
  };
  const handlechange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };
  return (
    <form onSubmit={handleSubmit} className="startscreen">
      <TextField
        required
        label="Player 1"
        name="player1"
        defaultValue=""
        placeholder="player 1"
        sx={{ marginBottom: "20px" }}
        onChange={handlechange}
      />
      {/* <TextField
        required
        label="Player 2"
        name="player2"
        defaultValue=""
        placeholder="player 2"
        sx={{ marginBottom: "20px" }}
        onChange={handlechange}
      /> */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "aqua", color: "black" }}
        type="submit"
      >
        Lets Play!
      </Button>
    </form>
  );
}

export default StartScreen;
