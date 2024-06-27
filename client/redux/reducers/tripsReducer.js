import { GET_ALL_TRIPS,LOADING_TRIPS_ERROR, SHARE_NEW_TRIP, SHARE_TRIP_ERROR } from "../actions/tripsActions";


const initialState={
    allTrips:[],
    mytrips:[],
    trip: null,
    error: [],
}

export default function(state=initialState,action){

    switch(action.type)
    {
        case GET_ALL_TRIPS: 
        return {
            ...state,
            allTrips: action.payload
        }
        case LOADING_TRIPS_ERROR:
        return {
            ...state,
            error: action.payload
        }
        case SHARE_NEW_TRIP: 
        return {
            ...state,
            allTrips:[...state.allTrips,action.payload]
        }
        case SHARE_TRIP_ERROR:
        return {
            ...state,
            error: action.payload
        }
                
       
    }
    return state;
}