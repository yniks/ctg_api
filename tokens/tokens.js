const dbAccess= await Import('../db/dbacces.js');
const tables=require('../db/tables')
dbAccess.table=await tables.getTable('ctg','token');
function getToken(token,fields=[],where={})
{
   return dbAccess.get(token,fields,where);
}
function addToken(token,clientData={})
{
    return dbAccess.put(token,clientData);
}
 function updateToken(token,clientData={},where={})
{
    return dbAccess.update(token,clientData,where);
}
module.resolve({
    getToken,
    addToken,
    updateToken
})