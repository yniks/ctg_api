const dbAccess= await Import('../db/dbacces.js');
const tables=require('../db/tables')
dbAccess.table=await tables.getTable('ctg','users');
async function getUser(token,fields=[],where={},depth=1)
{
   return dbAccess.get(token,fields,where,depth);
}
async function addUser(token,userData={})
{
    return dbAccess.put(token,userData);
}
async function updateUser(token,userData={},where={})
{
    return dbAccess.update(token,userData,where);
}
console.log(module.resolve)
module.resolve({
    getUser,
    addUser,
    updateUser
})