import { BOOK_TRIP_SUCESS,BOOK_TRIP_FAIL} from "../actions/reservationActions";


const initialState={
    reservations:[],
    myReservations:[],
    error: [],
}

export default function(state=initialState,action){

    switch(action.type)
    {
        case BOOK_TRIP_SUCESS: 
        return {
            ...state,
            myReservations: [...initialState.myReservations,action.payload]
        }
        case BOOK_TRIP_FAIL:
        return {
            ...state,
            error: action.payload
        }         
       
    }
    return state;
}