import { 
  USER_LOGIN,
  USER_LOGOUT, 
  } from './actionTypes';

import { logoutAccount } from "../../server/auth_routes";

export function userLogIn() {
  return {
    type: USER_LOGIN,
  };
}

export function userLogOutDispatch() {
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


