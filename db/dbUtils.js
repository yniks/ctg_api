const crypto = require("crypto");
function makeObjectPortable(obj,objname='',listoffns=[])
{
    for(let each in obj)
    {
        if(typeof obj[each]=='object')
              makeObjectPortable(obj[each],each,listoffns);
       else  
       {
           var key=`${objname+(objname?'.':'')+each.search(' ')==-1?each:each.split(' ')[0]}`;
           var join=each.search(' ')==-1?'=':each.split(' ').slice(1).join(' ');
           listoffns.push(`${key} ${join} '${obj[each]}'`);
       }
    }
  return  listoffns;
}
function ObjectTOWhereQuery(Obj)
{
    return makeObjectPortable(Obj).join('&&');
}
function generateUUID()
{
  return crypto.randomBytes(16).toString("hex");
}
function replaceAll(string,substring,replaceString)
{    
    if(string.search(substring)==-1)return string;
    return replaceAll(string.replace(substring,replaceString),substring,replaceString);
}
module.exports={
    ObjectTOWhereQuery,
    generateUUID,
    replaceAll
}