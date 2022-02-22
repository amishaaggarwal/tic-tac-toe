import { GET_KEY, GET_PLAYERS, SET_PLAYERS } from "constants/login-constants";

const initialState = {
  players: {
    player1: {
      name: "",
      ip: "",
    },
    player2: {
      name: "",
      ip: "",
    },
  },
  myKey: "",
  
};

const loginreducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYERS:
      return {
        ...state,
        players: action.payload,
      };

    case GET_PLAYERS:
      return {
        ...state,
        players: action.payload,
      }
    case GET_KEY:
      return {
        ...state, myKey: action.payload,
      }
    default:
      return state;
  }
};

export default loginreducer;
