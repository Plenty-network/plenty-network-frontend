import { loadingActionType } from "./action";

const innitialState={
    isLoading:false
}
export default function reducer(state=innitialState,action:any){
    switch(action.type){
        case loadingActionType.LOAD_FLASH_MESSAGE:{
            return {isLoading:action.isLoading}
        }
        case loadingActionType.LOAD_FLASH_MESSAGE:{
            return {isLoading:action.isLoading}
        }
        default:
          return state;
    }

}