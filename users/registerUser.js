const tokens=await Import('../tokens/tokens.js');
const org=await Import('../ctg/org.js');
const users=await Import('../users/users.js');
var tables=require('../db/tables.js');
var stdUsers=require('../users/standard_user_config.json');
var perms=await Import('../tokens/getpermissions.js');
const req_register_fields=['firstName','virtualID','contact','password','organisation']
async function registerUser(token,data={})
{
    var orgName=await org.getOrg(token,['shortName'],{id:data.organisation});
     data.virtualID=`${data.firstName}@${orgName[0].shortName}`;
    for(let each of req_register_fields)
        if(!data[each])
            throw `'${each}' is required in login!`;
    var userID=await users.addUser(token,data);
        if(!userID)
        {
            throw `Error in creating user '${data.firstName}'! Most probably due to missing fields or non unique data.`
        }
     var newToken=await perms.createToken(token,{...stdUsers.admin,userID:userID})// 2nd parameter is the detail of new token to be generated . Change it by admin details later.
    try
    {
        var tokenId=await tokens.addToken(token,{value:newToken,userID:userID});
    }
    catch(err)
    {
        //remove user
        throw err
    }
    if(!tokenId)
    {
        //remove user
        throw "Cannot create token! "
    }
    return userID;
}
module.resolve({
    registerUser
})