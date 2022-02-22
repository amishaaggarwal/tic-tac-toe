import { Outlet } from "react-router-dom";
import React from "react";
import "./Playscreen.scss";
import Footer from "components/Footer/Footer";

function PlayScreen() {

 
  return (
    <div className="playscreen">
      <h1 className="heading">Tic Tac Toe</h1>
      <Outlet />
      <Footer/>
    </div>
  );
}

export default PlayScreen;
