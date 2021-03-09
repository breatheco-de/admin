export const GET_ERROR = 'GET_ERROR';
export const GET_SUCCESS = 'GET_SUCCESS';

export function loadError(error){
    return { 
        type: GET_ERROR,
        data: null,
        error: error
     }
}

export function loadSuccess(result){
    return { 
        type: GET_SUCCESS,
        data: result,
        error: null
     }
}

