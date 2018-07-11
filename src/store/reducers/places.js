import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from '../actions/actionTypes';
//accept the messages from the action and change state

const initalState = {
    places: [],
    placeAdded: false
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

        case REMOVE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => {
                    // if true, will be added to the array
                    return place.key !== action.key;
                })
            }
        
        case PLACE_ADDED:
            return {
                ...state,
                placeAdded: true
            }
        
        case START_ADD_PLACE:
            return {
                ...state,
                placeAdded: false
            }
            
        default:
            return state;
    }
};

export default reducer;