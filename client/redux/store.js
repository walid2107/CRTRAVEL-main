import {legacy_createStore,applyMiddleware,combineReducers} from 'redux';
import { thunk } from 'redux-thunk';
import {composeWithDevTools} from '@redux-devtools/extension';

import authReducer from './reducers/authReducer';
import tripsReducer from './reducers/tripsReducer';
import reservationReducer from './reducers/reservationReducer'

const rootReducer=combineReducers({
    auth:authReducer,
    trips:tripsReducer,
    reservation:reservationReducer,
})

const middleware=composeWithDevTools(applyMiddleware(thunk));


export default legacy_createStore(rootReducer,middleware);
