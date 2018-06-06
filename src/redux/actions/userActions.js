import {
  USER_LOGIN,
  USER_LOGOUT
} from './actionTypes';

import {logoutAccount, authenticateAccount} from "../../server/auth_routes";

function userLogInDispatch() {
  return {
    type: USER_LOGIN,
  };
}

export function userLogIn(username, password) {
  return function (dispatch) {
    return authenticateAccount({username, password})
    .then(res => {
      dispatch(userLogInDispatch());
      return res
    })
    .catch(err => {
      console.log(err);
      return err
    });
  };
}

/* =============================================================================================  */


function userLogOutDispatch() {
  return {
    type: USER_LOGOUT,
  };
}

export function userLogOut() {
  return function (dispatch) {
    return logoutAccount()
    .then(res => {
      dispatch(userLogOutDispatch());
    })
    .catch(err => {
      console.log(err);
    });
  };
}