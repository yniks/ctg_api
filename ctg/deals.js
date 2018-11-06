const dbAccess= await Import('../db/dbacces.js');
const tables=require('../db/tables')
dbAccess.table=await tables.getTable('ctg','deals');
async function getDeal(token,fields=[],where={})
{
   return dbAccess.get(token,fields,where);
}
async function addDeal(token,clientData={})
{
    return dbAccess.put(token,clientData);
}
async function updateDeal(token,clientData={},where={})
{
    return dbAccess.update(token,clientData,where);
}
module.resolve({
    getDeal,
    addDeal,
    updateDeal
})