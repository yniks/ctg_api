const express=require('express')
var All=null
async function requestHandler(payload)
{  
    if(!All)
    {
        var {Import}=require('./utils/module.js');
        global.Import=Import;
        All=await Import('./collectionMain.js')
    }
    var token=payload.token;
    var procedure=payload.procedure;
    var data=payload.data||[];
    if(!procedure)
        throw "procedure needed!"
        try{
        var calledProc=procedure.split('/').reduce((All,item)=>All=All[item],All);
        }
        catch(err)
        {
            throw `${procedure} seems invalid procedure!`
        }
    if(typeof calledProc!='function')throw `${procedure} seems invalid procedure!`
    return calledProc(token,...data)
}
module.exports=requestHandler;
/**
 *  {
 *      token:'',
 *      procedure:'',
 *      data=[]
 * }
 * 
 */