import { GET_GAME_STATE, SET_GAME_STATE, SET_MODE } from "constants/game-constants"
import { child, get, set, ref } from "firebase/database";
import { db, gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import { getLocalStorage } from "utils/Storage/Storage";

const newKey = getLocalStorage("user-id");
export const getGameState = () => {
    let data;
    get(child(gameListRef, newKey + "/gamestate")).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    return {
        type: GET_GAME_STATE,
        payload: data,
    }
}

export const setGameState = (gs) => {
    // gameListRef.child(newKey).set("gamestate", gs).then(alert("updated")).catch((err) => console.log(err));
    // update(gameListRef, updatedState);
    set(ref(db, 'Game/' + newKey), {
        gamestate: gs
    });
    return {
        type: SET_GAME_STATE,
        payload: gs,
    }
}

export const setMode = (mode) => {
    return {
        type: SET_MODE,
        payload: mode,
    }
}