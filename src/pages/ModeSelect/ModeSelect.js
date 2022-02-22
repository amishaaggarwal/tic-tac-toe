import { Button, Stack } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setMode } from 'redux/gameredux/GameActions';

function ModeSelect() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const changeMode = (mymode) => {
        dispatch(setMode(mymode));
        navigate("/tic-tac-toe");
    }
    return (
        <Stack sx={{ backgroundColor: "#C0C0C0", padding: "60px" }} spacing={2}>
            <h1>Select Mode</h1>
            <Button onClick={() => changeMode("single")} variant="contained">Single Player</Button>
            <Button onClick={() => changeMode("multi")} variant="contained"> Multi Player</Button>
        </Stack>
    )
}

export default ModeSelect