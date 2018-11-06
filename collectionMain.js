
var mysql=require('../db/MysqlMaster.js');
var all={users:null,clients:null,deals:null};
await mysql.connect();
all.users=await Import('./users/users.js')
all.deals=await Import('./ctg/deals.js')
all.org=await Import('./ctg/org.js')
all.services=await Import('./ctg/services.js')
all.token=await Import('./tokens/tokens.js')
all.gettoken=await Import('./gettoken.js')
all.permissions=await Import('./tokens/getpermissions.js')
all.gettoken=await Import('./gettoken.js');
all.crypto=await Import('./crypto/lock.js')
var siteMap=[];
function findFunctions(obj={},objname='')
{
    var all=[];
    for(let each in obj)
    {
        if(typeof obj[each]=='function')
        {
            all.push(objname+(objname?'/':'')+each);
        }
        else if(typeof obj[each]=="object")
        {
            all=all.concat(findFunctions(obj[each],objname+(objname?'/':'')+each))
        }
    }
    return all;
}
all.siteMap=async function()
{
    //debugger;
    return findFunctions(all);
}
module.resolve(all);