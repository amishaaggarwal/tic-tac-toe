import { ref, update, get, child, onValue } from "firebase/database";
import { db } from "./FirebaseSetup";

//-function for reading firebase data
const readFireBase = async (endpoint, path) => {
  const snapshot = await get(child(ref(db), `${endpoint}/${path}`));
  console.log(snapshot.val());
  return snapshot.val();
};

//-function for updating firebase data
export const updateFireBase = (endpoint, newKey, keys, value) => {
  switch (endpoint) {
    case "Game":
      switch (keys) {
        case "gamestate":
          update(ref(db, `${endpoint}/${newKey}`), { gamestate: value });
          break;
        case "current":
          update(ref(db, `${endpoint}/${newKey}`), { current: value });
          break;
        case "players":
          update(ref(db, `${endpoint}/${newKey}`), { players: value });
          break;
        case "moveNow":
          update(ref(db, `${endpoint}/${newKey}`), { moveNow: value });
          break;
        case "lastMove":
          update(ref(db, `${endpoint}/${newKey}`), { lastMove: value });
          break;
        case "winner":
          update(ref(db, `${endpoint}/${newKey}`), { winner: value });
          break;
        default:
          break;
      }
      break;
    case "UserList":
      newKey = newKey.replace(/[^a-zA-Z/d]/g, "");
      switch (keys) {
        case "name":
          update(ref(db, `${endpoint}/${newKey}`), { name: value });
          console.log("xyz");
          break;
        case "email":
          update(ref(db, `${endpoint}/${newKey}`), { email: value });
          break;
        case "dp":
          update(ref(db, `${endpoint}/${newKey}`), { dp: value });
          break;
        case "total":
          {
            let newval;
            readFireBase("UserList", `${newKey}/total`).then((res) => {
              newval = res;
              console.log(newval);
              update(ref(db, `${endpoint}/${newKey}`), { total: newval + 1 });
            });
          }
          break;
        case "scoreCredit":
          {
            let newval;
            readFireBase("UserList", `${newKey}/scores/scoreCredit`).then(
              (res) => {
                newval = res;
                update(ref(db, `${endpoint}/${newKey}/scores/scoreCredit`), {
                  total: newval + 50,
                });
                console.log(newval, res);
              }
            );
          }
          break;
        case "gameID":
          {
            let newval;
            readFireBase("UserList", `${newKey}`).then((res) => {
              newval = res;
              console.log("output", newval);
              newval[value.gameid] = value;
              update(ref(db, `${endpoint}/${newKey}`), newval);
            });
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
};
