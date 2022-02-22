import TicTacGrid from "components/TicTacGrid/TicTacGrid";
import ModeSelect from "pages/ModeSelect/ModeSelect";
import PlayScreen from "pages/playscreen/PlayScreen";
import StartScreen from "pages/StartScreen/StartScreen";
import React from "react";
import { Routes, Route } from "react-router-dom";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<PlayScreen />}>
        <Route path="/" element={<StartScreen />} />
        <Route path="mode" element={<ModeSelect/>}/>
        <Route path="tic-tac-toe" element={<TicTacGrid/>}/>
      </Route>
    </Routes>
  );
}

export default Routing;
