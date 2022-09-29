export const setFlashMessage=(isTrue:boolean)=>{
    if(isTrue){
        return {type:loadingActionType.LOAD_FLASH_MESSAGE,isLoading:true}
    }
    return {type:loadingActionType.LOAD_FLASH_MESSAGE,isLoading:false}
}
export const loadingActionType={
    LOAD_FLASH_MESSAGE:'LOAD_FLASH_MESSAGE',
}
