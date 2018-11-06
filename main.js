const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const handle=require('./routeHandler.js');
app.use(bodyParser.json({extended:true}));
var sess = {
    secret: 'macmac',
    cookie: {}
}
const session=require('express-session');
app.use(session(sess));
function createReponse(procedure,err,data)
{
    var result={
        procedure,
        err:undefined,
        data:data,
        ok:true
    }
    if(err)
    {
        result.ok=false;
        result.err=err
    }
    return result;
}
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.post('/api',async function(req,res,next)
  {
      var payload=req.body;
      payload.token=payload.token?payload.token:req.session.token
      try{
          var response=await handle(payload);
          res.json(createReponse(payload.procedure,null,response))
      }
      catch(err)
      {
          console.log(err)
          res.json(createReponse(payload.procedure,err))   
      }
  })
  app.post('/login',async function(req,res)
  {
      req.session.token=req.body.token;
    res.json(createReponse('/login',null,'Session set!'))
  })
  app.post('/logout',async function(req,res)
  {
      req.session.token=undefined;
    res.json(createReponse('/logout',null,'Session unset!'))
  })
app.listen(80,()=>console.log('listing at port 80'))
app.use(express.static('../webview'))