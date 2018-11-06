const dbAccess= await Import('../db/dbacces.js');
const tables=require('../db/tables');
dbAccess.table=await tables.getTable('ctg','services');

async function getService(token,fields=[],where={})
{
   return dbAccess.get(token,fields,where);
}
async function addService(token,clientData={})
{
    return dbAccess.put(token,clientData);
}
async function updateService(token,clientData={},where={})
{
    return dbAccess.update(token,clientData,where);
}
module.resolve({
    getService,
    updateService,
    addService
})