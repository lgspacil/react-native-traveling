import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        // since token disappears we can create a variable to hold it
        let authToken;
        // send an action right when you start
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found");
            })
            .then((token) => {
                authToken = token;
                return fetch("https://us-central1-react-native-myt-1530315514387.cloudfunctions.net/storeImage", {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        "Authorization": "Bearer " + authToken
                    }
                })
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again")
                dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl
                };
                return fetch("https://react-native-myt-1530315514387.firebaseio.com/places.json?auth=" + authToken, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log(parsedRes)
                dispatch(uiStopLoading())
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again")
                dispatch(uiStopLoading());
            })
    };
};

export const getPlaces = () => {
    return dispatch => {
        // since authGetToken was set by a promise we can add a then catch statement to it
        dispatch(authGetToken())
            .then((token) => {
                return fetch("https://react-native-myt-1530315514387.firebaseio.com/places.json?auth="+ token)
            })
            .catch(() => {
                alert("No valid token found")
            })
            .then(res => res.json())
            .then(parsedRes => {
                const places = [];
                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        image: {
                            uri: parsedRes[key].image
                        },
                        key: key
                    });
                }
                dispatch(setPlaces(places));
            })
            .catch(err => {
                alert("something went wrong, sorry ;/");
                console.log(err);
            });
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    }
}

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found")
            })
            .then((token) => {
                // this method will remove the item locally
                dispatch(removePlace(key));
                return fetch("https://react-native-myt-1530315514387.firebaseio.com/places/" + key + ".json?auth=" + token, {
                    method: "DELETE"
                })
            })
            .then(res => res.json)
            .then(parsedRes => {
                console.log("Done!");
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again")
            });
    }
};

// this will remove the place in our local store
export const removePlace = (key) => {
    return {
        type: REMOVE_PLACE,
        key: key
    }
}



