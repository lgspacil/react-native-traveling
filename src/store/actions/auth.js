import {TRY_AUTH} from './actionTypes'
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
            if(paredRes.error){
                alert(paredRes.error.message)
            } else {
                // only start the main tabs when we dont have an error
                startMainTabs();
            }
            
        })
    };
};
