var mysql = require('mysql');

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });
    //POST /users
    router.post("/users",function(req,res){
        connection.query("INSERT INTO user SET ?",req.body,function(err,rows){
          if(err) {
              if(err.code === 'ER_DUP_ENTRY') {
                  res.json({"Error" : 201, "Message":"Created User"});
              }
              if(err.code ==='ER_PARSE_ERROR') {
                  res.json({"Error" : 400, "Message":"ErrorResponse"});
              }
              }
          else {
              res.json({"Status": 200, "User" : {
                  "lastname": req.body.lastname,
                  "firstname": req.body.firstname,
                  "email": req.body.email,
                  "phones": req.body.phones,
                  "role": req.body.role
              }
            });
        }
      });
  });
  //PUT /user/{uid}
  router.put("/user/:id",function(req,res){
      connection.query("UPDATE user set ? WHERE id = ?",[req.body,req.params.id],function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : err});
        } else {
            res.json({"Modification effectué" : {
                "firstname" : req.body.firstname,
                "lastname" : req.body.lastname,
                "email" : req.body.email,
                "role" : req.body.role,
                "phones" : req.body.phones,
                "uid" : req.body.id
            }
        });
    }
});
});
  //DELETE /user/{uid}
  router.delete("/user/:id",function(req,res){
      var id = req.params.id;
      connection.query("DELETE from user WHERE id = ?",[id],function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : err});
          } else {
              res.json({"Status" : 204, "Message" : err});
          }
      });
  });
   //GET /user/{uid}
  router.get("/user/:id",function(req,res){
      var id = req.params.id;
      connection.query("SELECT id,lastname,firstname,email,phones,role FROM user WHERE id = ?",[id],function(err,rows){
          if(err){
              throw err;
              }
           else {
              res.json({"Status" : 200, "User" : rows});
          }
      });
  });
  //GET /users
  router.get("/users",function(req,res){
    connection.query("SELECT id,lastname,firstname,email,phones,role FROM user",function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : err});
            } else {
                res.json({"Status" : 200, "Users" : rows});
            }
        });
  });
//GET /users/search
  // router.get("/users/search", function(req,res){
  //     connection.query('SELECT lastname FROM user WHERE lastname LIKE "%'+req.query.key+'%"',function(err,rows,fields) {
  //         if (err) throw err;
  //         var data =[];
  //         for(i=0;i<rows.length;i++)
  //         {
  //             data.push(row[i].lastname);
  //         }
  //         res.end(JSON.stringify(data));
  //     });
  // });
  //je n arrive pas a faire fonctionner cette partie et avec les parametres q et count, je souhaite avoir une correction sur ce point la.
    //merci

  router.get("/users/search", function(req,res){
      connection.query('SELECT * FROM user WHERE email LIKE "%'+req.query.search+'%"',function(err,rows,fields) {
          if (err) throw err;
          var data = [];
          for(i=0;i<rows.length;i++)
          {
              data.push(row[i]);
          }
          res.end(JSON.stringify(data));
      });
  });

}
module.exports = REST_ROUTER;
