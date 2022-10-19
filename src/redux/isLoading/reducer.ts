import { loadingActionType } from "./action";

const innitialState={
    isLoading:false
}
export default function reducer(state=innitialState,action:any){
    switch(action.type){
        case loadingActionType.SET_LOADING_TRUE:{
            return {isLoading:action.isLoading}
        }
        case loadingActionType.SET_LOADING_FALSE:{
            return {isLoading:action.isLoading}
        }
        default:
          return state;
    }

}