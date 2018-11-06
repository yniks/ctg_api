var lock = await Import('../crypto/lock.js')
const dbUtils = require('../db/dbUtils')
const mysql = require('../db/MysqlMaster')
await mysql.connect()
var tables = require('../db/tables');
//permcode
var perm_table = await tables.getTable('ctg', 'permissions')
var permToken = {
    permissions_read: 'allow',
}
/**
 * snippet from permission moduel is used here because that module cant be iported because of lack of support for recursive modules
 */
var permissions = [{
    id: 'allow',
    value: '1=1'
}];
permissions = permissions.concat(await get.call({
    table: perm_table
}, permToken, ['id', 'value']));
// function execPermValue(statements)
// {
//     var andsubStatements=typeof statements=='string'? statements.split(' and '):statements;
//     var response=null
//     var statement=andsubStatements[0];
//     if(statement.search('!=')!=-1)
//     {
//         var op1=statement.split(/!=/)[0].trim()
//         var op2=statement.split(/!=/)[1].trim()
//         response= op1!=op2;
//     }
//     else if(statement.search('=')!=-1)
//     {
//         var op1=statement.split(/=/)[0].trim()
//         var op2=statement.split(/=/)[1].trim()
//         response= op1==op2;
//     }
//     return response*execPermValue(andsubStatements.shift(1))
// }
async function getPermValue(perms = []) {
    var result = []
    for (let each of perms) {
        for (let i of permissions) {
            if (i.id == each) {
                result.push({
                    id: i.id,
                    value: i.value
                });
                break;
            }
        }
        if (!result.length || result[result.length - 1].id != each) {
            result.push({
                id: each,
                value: '1=0'
            });
        }
    }
    // for(let each of permissions)
    // {
    //     if( perms.includes(each.id))
    //     {
    //         result.push({id:each.id,value:each.value});
    //     }
    // }
    return result
}
//perm code
async function get(token, fields = [], where = {}, depth = 1) {
    if (typeof token == 'string') {
        token = JSON.parse(await lock.decrypt(token));
    }
    if (fields.length == 0)
        fields = Object.keys(this.table.fields);
    var it = this;
    var fieldsToQuery = fields.map((item) => it.table.tableName + '.' + item + ' as ' + item);
    async function createConditions(whereObj,conditions={})
    {
        for (let each in whereObj) {
            let val = whereObj[each];
            if(typeof val=='object' && this.fields[each]!=null)
            {
                createConditions.call(await tables.getTable(this.schemaName, this.fields[each]),{...val,["id="+this.tableName+'.'+each]:""},conditions);
            }
            else conditions[this.tableName + '.' + each] = val;
        }
        return conditions;
    }
    var condition=await createConditions.call(it.table,where);
    var wheretoquery = dbUtils.ObjectTOWhereQuery(condition);
    var perm = await getPermValue([token[this.table.tableName + '_read']]);
    wheretoquery = (wheretoquery ? wheretoquery + ' AND ' : '') + (dbUtils.replaceAll(perm[0].value, '"""userID', `'${token.userID}'`) || '1=2')

    var tablesToQuery = (perm[0].value || '').match(/\b[\w\.]+(?=(\.\w))\b/ig) //find tables in token
    tablesToQuery = tablesToQuery ? tablesToQuery.map(item => item.split('.').pop()) : [];
    tablesToQuery.includes(it.table.tableName) ? null : tablesToQuery.push(it.table.tableName)
    tablesToQuery = [...(new Set(tablesToQuery))]
    tablesToQuery = tablesToQuery.join(',')
    var getDataQuery = `
        SELECT ${fieldsToQuery}
        FROM ${tablesToQuery}
        WHERE ${wheretoquery}`
    var result = await mysql.ExecuteQuery(getDataQuery);

    for (let row of result) {
        for (let field in row) {
            if (row[field] == null) continue;
            else {
                if (depth > 1 && row[field].startsWith('##') && !row[field].startsWith('##' + this.table.tableName)) //key found
                {
                    var target = row[field].split('#');
                    var targettableName = target[2];
                    var object = await get.call({
                        table: await tables.getTable(it.table.schemaName, targettableName)
                    }, token, [], {
                        id: row[field]
                    }, depth - 1)
                    row[field] = object[0];
                }
            }
        }
    }
    return result;
}
async function put(token, fields = {}) {
    if (typeof token == 'string') {
        token = JSON.parse(await lock.decrypt(token));
    }
    var it = this;
    //debugger;
    for (let each in fields) {
        if (!(each in this.table.fields)) throw `cannot set ${each}`;
        if (typeof fields[each] == 'object' && this.table.fields[each] != null) {
            fields[each] = await put.call({
                table: await tables.getTable(it.table.schemaName, this.table.fields[each])
            }, token, fields[each]);
        }
    }
    if (typeof fields.id != 'string' || !fields.id.match(/^##.+#.+$/)) {
        fields.id = '##' + this.table.tableName + '#' + dbUtils.generateUUID();
    }
    var perm = await getPermValue([token[this.table.tableName + '_write']]);
    var wheretoquery = dbUtils.replaceAll(perm[0].value, '"""userID', `'${token.userID}'`) || '1=2'

    var toBeInsertedFields = Object.keys(fields);
    var toBeInsertedValues = Object.values(fields);
    var tablesToQuery = (perm[0].value || '').match(/\b[\w\.]+(?=(\.\w))\b/ig) //find tables in token
    tablesToQuery = tablesToQuery ? tablesToQuery.map(item => item.split('.').pop()) : [];
    tablesToQuery.includes(it.table.tableName) ? null : tablesToQuery.push(it.table.tableName);
    tablesToQuery = [...(new Set(tablesToQuery))]
    tablesToQuery = tablesToQuery.join(',');

    var insertQuery = `INSERT INTO ${this.table.tableName} (${toBeInsertedFields.join(',')}) 
                    SELECT ${"'"+toBeInsertedValues.join("','")+"'"}
                        FROM dual
                        WHERE  EXISTS (SELECT * FROM ${tablesToQuery}
                                                WHERE ${wheretoquery} )
    `
    return await mysql.ExecuteQuery(insertQuery).then(result => {
        if (result.affectedRows) return fields.id;
        else return null;
    })
}
async function update(token, fields = {}, where = {}) {
    if (typeof token == 'string') {
        token = JSON.parse(await lock.decrypt(token));
    }
    var it = this;
    for (let each in fields) {
        if (!(each in this.table.fields)) throw `cannot set ${each}`;
        if (typeof fields[each] == 'object' && this.table.fields[each] != null) {
            fields[each] = await update.call({
                    table: await tables.getTable(it.table.schemaName, this.table.fields[each])
                },
                token,
                fields[each], {
                    id: await get.call({
                            table: await tables.getTable(it.table.schemaName, this.table.fields[each])
                        },
                        token,
                        ['id'],
                        where
                    ).then(result => result[0].id)
                });
        }
    }
    var perm = await getPermValue([token[this.table.tableName + '_update']]);
    var condition={}
    for (let each in where) {
        let val = where[each];
        condition[it.table.tableName + '.' + each] = val;
    }
    var wheretoquery = dbUtils.ObjectTOWhereQuery(condition);
    wheretoquery = (wheretoquery ? wheretoquery + ' AND ' : '') + (dbUtils.replaceAll(perm[0].value, '"""userID', `'${token.userID}'`) || '1=2')

    var tablesToQuery = (perm[0].value || '').match(/\b[\w\.]+(?=(\.\w))\b/ig) //find tables in token
    tablesToQuery = tablesToQuery ? tablesToQuery.map(item => item.split('.').pop()) : [];
    tablesToQuery.includes(it.table.tableName) ? null : tablesToQuery.push(it.table.tableName)
    tablesToQuery = [...(new Set(tablesToQuery))]
    tablesToQuery = tablesToQuery.join(',');
    var fieldandValueString = '';
    for (let each in fields) {
        fieldandValueString += it.table.tableName + '.'+each + "= '" + fields[each] + "', ";
    }
    fieldandValueString = fieldandValueString.slice(0, -2)
    var updateQuery = `UPDATE ${tablesToQuery}
                    set ${fieldandValueString}
                    where ${wheretoquery}`
    return await mysql.ExecuteQuery(updateQuery).then(async result => {
        if (result.affectedRows)
            return await get.call({
                    table: await tables.getTable(it.table.schemaName, this.table.tableName)
                },
                token,
                ['id'],
                where
            ).then(result => result[0].id);
        else return null;
    })
}
module.resolve({
    get,
    put,
    update
})