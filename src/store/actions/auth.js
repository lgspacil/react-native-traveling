import {AsyncStorage} from 'react-native'
import {TRY_AUTH, AUTH_SET_TOKEN} from './actionTypes'
import {uiStartLoading, uiStopLoading} from './index';
import startMainTabs from "../../screens/MainTabs/startMainTab";

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        dispatch(uiStartLoading());
        const apiKey = "AIzaSyBDgdcyCHrbsEyS5p0rM1hYVe656e1g8y4"
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key="+apiKey
        if(authMode === "signup"){
            url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="+apiKey
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: authData.email,
                password: authData.password,
               returnSecureToken: true 
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(err => {
            console.log(err)
            dispatch(uiStopLoading());
            alert("Auth failed, please try again")
        })
        .then(res => res.json())
        .then(paredRes => {
            dispatch(uiStopLoading());
            if(!paredRes.idToken){
                alert(paredRes.error.message)
            } else {
                dispatch(authStoreToken(paredRes.idToken));
                // only start the main tabs when we dont have an error
                startMainTabs();
            }
            
        })
    };
};

// saving the token to your device for quick login
export const authStoreToken = token => {
    return dispatch => {
        dispatch(authSetToken(token));
        // first param is key 
        AsyncStorage.setItem("ap:auth:token", token);
    }
};


export const authSetToken = token => {
    return {
        type: AUTH_SET_TOKEN,
        token: token
    }
}

// this will be acted as a helper function
export const authGetToken = () => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        const promise = new Promise((resolve, reject) => {
            if(!token){
                // could not find the token so you try to get it from our phone's memory
                AsyncStorage.getItem("ap:auth:token")
                    .catch(err => reject())
                    .then(tokenFromStorage => {
                        if(!tokenFromStorage){
                            reject();
                            return;
                        }
                        dispatch(authSetToken(tokenFromStorage));
                        resolve(tokenFromStorage);
                    })
            } else {
                resolve(token);
            }
        })
        return promise;
    };
};

export const authAutoSignIn = () => {
    return dispatch => {
        dispatch(authGetToken())
        .then(token => {
            startMainTabs();
        })
        .catch(err => {
            console.log("error", err)
        })

    }
}