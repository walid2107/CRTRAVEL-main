import { BOOK_TRIP_SUCESS,BOOK_TRIP_FAIL, GET_ALL_RESERVATIONS, CONFIRM_RESERVATION, CONFIRM_PAYMENT} from "../actions/reservationActions";


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
            myReservations: [...state.myReservations,action.payload]
        }
        case BOOK_TRIP_FAIL:
        return {
            ...state,
            error: action.payload
        }   
        case GET_ALL_RESERVATIONS: 
        return {
            ...state,
            reservations: action.payload
        }     
        case CONFIRM_RESERVATION:{
        const updatedReservations=state.reservations.map((reservation)=>{
            if(reservation._id == action.payload)
                {
                    return {...reservation,confirmed:true}
                }else{
                    return reservation;
                }
        })
        return {
            ...state,
            reservations:updatedReservations 
        }
        }    
        case CONFIRM_PAYMENT:{
            const updatedReservations=state.reservations.map((reservation)=>{
                if(reservation._id == action.payload)
                    {
                        return {...reservation,paymentMade:true}
                    }else{
                        return reservation;
                    }
            })
            return {
                ...state,
                reservations:updatedReservations 
            }
            }    
    }
    return state;
}