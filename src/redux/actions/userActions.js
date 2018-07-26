import {OFFLINE_ACTIONS, USER_LOGIN, USER_LOGOUT} from "./actionTypes";

import {authenticateAccount, logoutAccount} from "../../server/auth_routes";

function userLogInDispatch() {
    return {
        type: USER_LOGIN,
    };
}

export function userLogIn(username, password) {
    return function (dispatch) {
        // Authenticate any log in attempt (for offline development)
        if (OFFLINE_ACTIONS) {
            dispatch(userLogInDispatch());
            return {success: true};
        }

        // Service authentication request by dispatching to backend
        return authenticateAccount({username, password})
            .then((res) => {
                dispatch(userLogInDispatch());
                return res;
            })
            .catch((err) => {
                console.log(err);
                return err;
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
            .then((res) => {
                dispatch(userLogOutDispatch());
            })
            .catch((err) => {
                console.log(err);
            });
    };
}