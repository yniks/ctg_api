//super-admin module
var {tokenSources,defaultToken}=require('../auth_config.json');
var all={}
for(let each of tokenSources)
{
    let name=each.match(/\w+(?=\.)/ig);
    //debugger; 
    let temp=await Import(each);
    all[name]=async function(...arg)
    {
        if(typeof arg[0]!='object')var ptoken=arg.shift(1)
        //debugger;
        return temp[name](ptoken||defaultToken,...arg);
    }
}
module.resolve(
    all
)