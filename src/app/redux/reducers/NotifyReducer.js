import { CardActions } from "@material-ui/core";
import { GET_ERROR, GET_SUCCESS } from "../actions/NotifyActions";

const initialState = {}

const NotifyReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ERROR: {
            return 
        }
        case GET_SUCCESS: {
            return
        }
    }
}