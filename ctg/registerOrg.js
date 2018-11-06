const org=await Import('../ctg/org.js');
const tokens=await Import('../tokens/tokens.js');
var tables=require('../db/tables.js');
const usersReg=await Import('../users/registerUser.js')
var orgField=await tables.getTable('ctg','org');
var usersField=await tables.getTable('ctg','users');
async function registerOrg(token,data={})
{
    var userdata={};
    var orgdata={};
    for(let each in data)
    {
        if(each in usersField.fields)
            userdata[each]=data[each];
        if(each in orgField.fields)
            orgdata[each]=data[each];
    }
    var oid=await org.addOrg(token,orgdata);
    if(oid==null)
    {
        throw "Cannot register Organisation! Probababy 'fullName' , 'email' is not Unique."
    }
    userdata.organisation=oid;
    try
    {
        var userID=await usersReg.registerUser(token,userdata);
    }
    catch(err)
    {
        //remove organisation
        throw err;
    }
    await org.updateOrg(token,{admin:userID},{id:oid})
    return (await tokens.getToken(token,['value'],{userID:userID}))[0].value;
}
module.resolve({registerOrg})