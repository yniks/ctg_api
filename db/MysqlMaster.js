const mysql=require('mysql');
global.db=null;
const creds={
    "host":"localhost",
    "port":3306,
    "user":"root",
    "password":"newpassword",
    "database":"ctg"
}
async function connect(config,cb)
{
    console.log(creds||config);
    return new Promise((res,rej)=>
    {
        let con=mysql.createConnection(creds||config);
        var conerror=(e)=>{db=null;throw e;};
        con.connect((err)=>
        {
            if(err)conerror(err);
            else db=con;
            res(db);
        });
        con.on('error',conerror);
    })
}
async function createdb(dbname)
{
    if(!dbname)throw "illegale dbname";
    return ExecuteQuery("CREATE DATABASE "+dbname+"",cb)  
}
async function ExecuteQuery(qr="")
{
    if(db==null)throw "db not connected";
    return new Promise((res,rej)=>
    {
        db.query(qr,(err,result)=>
        {
            if(err)rej(err.code)//or handle exception
            else res(result);
        });
    })
}
process.on('uncaughtException',console.log)
module.exports={connect,ExecuteQuery,createdb}