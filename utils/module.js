var fs=require('fs')
var vm=require('vm')
var path=require('path');
var running={}
function clearCache()
{
    running={}
}
async function launch(filename,root='')
{
    var pt=path.resolve(path.join(root,filename));
    var dir=path.dirname(pt);
    if(running[pt])return running[pt];
   var module={exports:{}}
    var context={
        String,
        Import: (module,root='')=>Import(module,root||dir),
        global,
        exports:module.exports,
        module,
        require,
        __filename:pt,
        __dirname:path.dirname(pt)
    }
    return new Promise((res,rej)=>{
    fs.readFile(pt,(err,buffer)=>
    {   var head=`(async function (){   `
        var foot=`  })()`
        if(err)throw err;
        else
        {
            
            var contextified=vm.createContext(context);
            var fileContent=buffer.asciiSlice();
            var code=head+fileContent+foot;
            context.module.resolve=(obj)=>{
                    running[pt]=obj||contextified.module.exports;
                    res(obj||contextified.module.exports);
            }
            var script=new vm.Script(code,{filename:pt});
            script.runInContext(contextified);
            
        }
    })})
}
global.Import=async function(module,root='')
{
    var context={}
    var object=await launch(module,root);
    for(let each in object)
        if(typeof object[each]=='function')
            Object.defineProperty(context,each,{
                enumerable:true,
                get(){return object[each].bind(context)},
            })
        else Object.defineProperty(context,each,{
            enumerable:true,
            get(){return object[each]}
        })
    return context;/*

    for(let each in object)
        if(typeof object[each]=='function')
            context[each]=(...arg)=>object[each].call(context,...arg);
        else context[each]=object[each];
    return context;*/
}
module.exports={
    Import:global.Import,
    launch,
    clearCache
}