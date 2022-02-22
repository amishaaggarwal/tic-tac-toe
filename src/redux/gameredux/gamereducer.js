import { GET_CURRENT_TURN, GET_GAME_STATE, SET_CURRENT_TURN ,SET_MODE} from "constants/game-constants";

const initialState = {
    board: [],
    Current: "",
    mode:"",
};

const gamereducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_TURN:
            return {
                ...state,
                Current: action.payload,
            };

        case GET_CURRENT_TURN:
            return {
                ...state,
                Current: action.payload,
            }
        case GET_GAME_STATE:
            return {
                ...state,
                board: action.payload,
            }
        case SET_MODE:
            return {
                ...state,
                mode:action.payload,
            }
        default:
            return state;
    }
};

export default gamereducer;
