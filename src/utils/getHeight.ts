export const getHeightOfElement=(el:any)=> {
    try{
    const rect = el.getBoundingClientRect();
    return window.innerHeight-rect.top-rect.height-10;
    }
    catch(e){
        return 0;
    }
  }