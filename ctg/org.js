const dbAccess=  await Import('../db/dbacces.js');
const tables=require('../db/tables')
dbAccess.table=await tables.getTable('ctg','org');
async function getOrg(token,fields=[],where={})
{
   return dbAccess.get(token,fields,where);
}
async function addOrg(token,orgData={})
{
    return dbAccess.put(token,orgData);
}
async function updateOrg(token,orgData={},where={})
{
    return dbAccess.update(token,orgData,where);
}
module.resolve({
    getOrg,
    addOrg,
    updateOrg
})