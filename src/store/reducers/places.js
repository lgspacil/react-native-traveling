import { ADD_PLACE, DELETE_PLACE } from '../actions/actionTypes';
//accept the messages from the action and change state

const initalState = {
    places: []
};

// in the reducer we can find out wich action occurred 
// the spread operator pulls all the properties from the old state and adds them to the new object
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case ADD_PLACE:
            return {
                ...state,
                places: state.places.concat({
                    key: Math.random(),
                    name: action.placeName,
                    image: {
                        uri: "http://fotofrenzy.com.au/wp-content/uploads/2017/06/Wave_Eye-1024x683.jpg"
                    },
                    location: action.location
                })
            };
        case DELETE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => {
                    // if true, will be added to the array
                    return place.key !== action.placeKey;
                })
            }
        default:
            return state;
    }
};

export default reducer;