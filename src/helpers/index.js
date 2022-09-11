export const isValidIP = ( str = "" ) => {
    let verdad = str.split('.');
    if( verdad.length !== 4 ) return false;

    for( let i in verdad ){
      if(!/^\d+$/g.test(verdad[i]) ||+verdad[i]>255 ||+verdad[i]<0 ||/^[0][0-9]{1,2}/.test(verdad[i]))
        return false;
    }
    
    return true
}