import { SET_PLACES } from '../actions/actionTypes';
//accept the messages from the action and change state

const initalState = {
    places: []
};

// in the reducer we can find out wich action occurred 
// the spread operator pulls all the properties from the old state and adds them to the new object
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                places: action.places
            };

        // case DELETE_PLACE:
        //     return {
        //         ...state,
        //         places: state.places.filter(place => {
        //             // if true, will be added to the array
        //             return place.key !== action.placeKey;
        //         })
        //     }
        default:
            return state;
    }
};

export default reducer;