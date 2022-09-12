export const getHeightOfElement=(el:any)=> {
    try{
    const rect = el.getBoundingClientRect();
    return rect.top+rect.clientHeight+10;
    }
    catch(e){
        return 0;
    }
  }