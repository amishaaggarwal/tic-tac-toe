import React from 'react'
import "./WinningScreen.scss";
import { useSelector } from "react-redux";
import { CROSS } from 'constants/game-constants';

function WinningScreen(props) {
  const play = useSelector((state) => state.user.players);

  return (

    <div className='zoom-in'>{props.winnerIs===CROSS ? play.players.player1.name : play.players.player2.name} Won!</div>
  
  )
}

export default WinningScreen