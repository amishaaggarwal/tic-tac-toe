import { Outlet } from "react-router-dom";
import React from "react";
import Footer from "components/Footer/Footer";
import DrawerLeft from "components/DrawerLeft/DrawerLeft";
import "./Playscreen.scss";

function PlayScreen() {
  return (
    <div className="playscreen">
      <h1 className="heading">Tic Tac Toe</h1>
      <DrawerLeft/>
      <Outlet />
      <Footer />
    </div>
  );
}

export default PlayScreen;
