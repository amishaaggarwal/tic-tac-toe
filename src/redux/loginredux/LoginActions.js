import { GET_KEY, GET_PLAYERS, SET_PLAYERS } from "constants/login-constants";
import { child, push, get, update } from "firebase/database";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import { getLocalStorage, setLocalStorage } from "utils/Storage/Storage";


let newKey;
export function setPlayers(user) {
  newKey = push(child(gameListRef, "Game")).key;
  const updates = {};
  updates[newKey] = user;
  setLocalStorage("user-id", newKey);
  update(gameListRef, updates);
  return {
    type: SET_PLAYERS,
    payload: user,
  };
}

export function getKey() {
  newKey = getLocalStorage("user-id");
  return {
    type: GET_KEY,
    payload: newKey,
  }
}
export function getPlayers() {
  let data;
  get(child(gameListRef, newKey + "/players")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  return {
    type: GET_PLAYERS,
    payload: data,
  };
}
