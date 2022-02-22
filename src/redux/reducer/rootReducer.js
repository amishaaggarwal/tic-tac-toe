import { combineReducers } from "redux";
import gamereducer from "redux/gameredux/gamereducer";
import loginreducer from "redux/loginredux/loginreducer";


export default combineReducers({
  user: loginreducer,
  game:gamereducer
});
