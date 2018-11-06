const dbAccess= await Import('../db/dbacces.js');
const tables=require('../db/tables');
dbAccess.table=await tables.getTable('ctg','permissions');
var lock=await Import('../crypto/lock.js')
var permToken={permissions_read:'allow'}
var permissions=await dbAccess.get(permToken,['id','value','level']);
 function comparePerms(permcode1='deny', permcode2='deny')
{
    for(let each of permissions)
    {
        if(each.id ==permcode1)
            var levelofPerm1=each.level;
        if(each.id ==permcode2)
            var levelofPerm2=each.level;
        if(levelofPerm1&&levelofPerm2)break;
    }
    if(!(levelofPerm1&&levelofPerm2))return 0;
    var pre1=levelofPerm1.split('_')[0];
        var post1=levelofPerm1.split('_')[1]
    var pre2=levelofPerm2.split('_')[0]
        var post2=levelofPerm2.split('_')[1]
    //debugger;
    if(pre1==pre2||(pre1==''||pre2==''))
        {
            return post2-post1+1;
        }
    else return 0
}
 function getPermValue(perms=[])
{
    var result=[]
    for(let each of permissions)
    {
        if( perms.includes(each.id))
        {
            result.push({id:each.id,value:each.value});
        }
    }
     return result;
}
function addPerm(token,permData={})
{
    return dbAccess.put(token,permData);
}
function updatePerm(token,permData={},where={})
{
    return dbAccess.update(token,permData,where);
}
async function createToken(token,permdata={})
{
    if(typeof token=='string')
    {
        token=JSON.parse(await lock.decrypt(token));
    }
    permdata={...permdata};//copy
    var resulttoken={};
    if(!permdata.exp_date)
        permdata.exp_date=token.exp_date
    if(permdata.exp_date<=token.exp_date)
    {
        resulttoken.exp_date=permdata.exp_date;
    }
    else
    {
        throw "expiry date beyond your scope";
    }
    resulttoken.userID=permdata.userID;
    delete permdata.exp_date;
    delete permdata.userID;
    for(let each in permdata)
    {
        if(comparePerms(token[each],permdata[each])>0)//1st's permisstion are greeater
        {
            resulttoken[each]=permdata[each];
        }
        else 
        {
            throw `Setting '${each}' as provided value needs higher level authentication.`
        }
    }
    return lock.encrypt(JSON.stringify(resulttoken));
}
module.resolve({
    getPermValue,
    addPerm,
    updatePerm,
    createToken
})