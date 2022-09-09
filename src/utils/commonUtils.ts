export const generateRandomString=(length:number):string =>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
export const tEZorCTEZTtoUpperCase=(a:string)=> (a.trim().toLowerCase() === 'tez' || a.trim().toLowerCase() === 'ctez')?a.toUpperCase():a;
