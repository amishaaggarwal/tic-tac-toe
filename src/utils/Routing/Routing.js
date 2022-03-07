import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import Multiplayer from "components/Multiplayer/Multiplayer";
import TicTacGridSinglePlayer from "components/TicTacGridSinglePlayer/TicTacGridSinglePlayer";
import ModeSelect from "pages/ModeSelect/ModeSelect";
import PlayScreen from "pages/playscreen/PlayScreen";
import StartScreen from "pages/StartScreen/StartScreen";
import React from "react";
import { Routes, Route } from "react-router-dom";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<PlayScreen />}>
        <Route path="/" element={<ModeSelect />} />
        <Route path="/lb" element={<LeaderBoard />} />
        <Route
          path="tic-tac-toe-single-player"
          element={<TicTacGridSinglePlayer />}
        />
        <Route path="tic-tac-toe/:newKey" element={<Multiplayer />} />
        <Route path=":newKey" element={<StartScreen />} />
      </Route>
    </Routes>
  );
}

export default Routing;
