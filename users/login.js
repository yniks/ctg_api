const users=await Import('../users/users.js')
const tokens=await Import('../tokens/tokens.js')
const req_login_fields=['email','password',]
async function login(token,data={})
{
    for(let each of req_login_fields )
        if(!data[each])
            throw `'${each}' is required in login!`;
    //ignring esaping for now
    var userID=await users.getUser(token,['id'],{email:data.email,password:data.password});
    userID=userID[0]?userID[0].id:null;
    if(userID==null)
    {
        throw "User not found! Most probably credentials are not correct!";
    }
    //debugger;
    var userToken=await tokens.getToken(token,['value'],{userID:userID})
    userToken=userToken[0]?userToken[0].value:null
    if(userToken==null)
    {
        throw "No Token found for given credentials.Try recreating it.";
    }
    return userToken;
}
module.resolve({login})