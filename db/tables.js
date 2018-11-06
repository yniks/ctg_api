const dbUtils=require('./dbUtils');
const mysql=require('./MysqlMaster')
var tables={}
async function describeTable(schemaName='',tableName='')
{
    if(tables[schemaName+'.'+tableName])
        return tables[schemaName+'.'+tableName];
    var tableDescription=await mysql.ExecuteQuery(`describe ${schemaName+'.'+tableName}`)
    var foregnKeyDescription=await mysql.ExecuteQuery(` select CONSTRAINT_NAME,REFERENCED_TABLE_NAME from INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
        where CONSTRAINT_SCHEMA='${schemaName}' AND TABLE_NAME='${tableName}'`)
    var fields={}
    for(let each of tableDescription)
    {
        fields[each.Field]=null
    }
    for(let each of foregnKeyDescription)
    {
        let temp=each.CONSTRAINT_NAME.split('_');
            temp.shift(1)
        fields[temp.join('_')]=each.REFERENCED_TABLE_NAME
    }
    tables[schemaName+'.'+tableName]={tableName,schemaName,fields}
    return  tables[schemaName+'.'+tableName];
}
module.exports={
    getTable:describeTable
}