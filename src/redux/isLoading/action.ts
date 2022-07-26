export const setLoading=(isTrue:boolean)=>{
    if(isTrue){
        return {type:loadingActionType.SET_LOADING_TRUE,isLoading:true}
    }
    return {type:loadingActionType.SET_LOADING_TRUE,isLoading:false}
}


   

export const loadingActionType={
    SET_LOADING_FALSE:'SET_LOADING_FALSE',
    SET_LOADING_TRUE:'SET_LOADING_TRUE',
}