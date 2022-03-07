import { ref, update, get, child } from "firebase/database";
import { db } from "./FirebaseSetup";

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
          break;
        case "email":
          update(ref(db, `${endpoint}/${newKey}`), { email: value });
          break;
        case "dp":
          update(ref(db, `${endpoint}/${newKey}`), { dp: value });
          break;
        case "total":
          {
            let newval = readFireBase("UserList", `${newKey}/total`);
            console.log(newval);
            // update(ref(db, `${endpoint}/${newKey}`), { total: newval + 1 });
          }
          break;
        case "score-credits":
          {
            let newval = readFireBase("UserList", `${newKey}/scores/score-credits`);
            // update(ref(db, `${endpoint}/${newKey}/scores/score-credits`), {
            //   total: newval + 50,
            // });
            console.log(newval);
          }
          break;
        case "gameID":
          {
            let newval = readFireBase("UserList", "gameID");
            newval[value.gameid] = value;
            console.log(newval);
            // update(ref(db, `${endpoint}/${newKey}`), {
            //   gameID: newval,
            // });
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

//-function for reading firebase data
export const readFireBase = (endpoint, path) => {
  get(child(db, `UserList`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        return snapshot.val();
      } else {
        console.log("No data available");
        return 0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
