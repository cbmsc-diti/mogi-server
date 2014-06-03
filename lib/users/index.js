var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    auth = require('./../auth'),
    config = require('./../config'),
    path = require('path'),
    templatesDir   = path.resolve(__dirname, '..', 'templates'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

app.get('/users/me', auth.ensureAdmin, function (req, res) {
    db.Group.find(req.user.groupId).success(function(group){
        res.json({
            id : req.user.id,
            username: req.user.username,
            group: group != null ? {name: group.name , lat:group.lat, lng:group.lng, id: group.id}:{}});
    });
});

app.get('/users/online', auth.ensureAdmin, function(req,res) {
  var date = moment().set('m', -10), where;

  db.Group.find(req.user.groupId).success(function(group){
      if (group == null ||  group.isAdmin === true){
          where = { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }};
      } else {
          where = { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }, groupId: req.user.groupId};
      }
      db.User.findAll({ where : where,
          attributes : ['id','name', 'lastLat', 'lastLng', 'groupId']})
        .success(function (users) {
          res.send(users.map(function(user) {
              return {
                  id : user.id,
                  name: user.name,
                  lat: user.lastLat,
                  lng: user.lastLng,
                  group: user.getGroup() != null ? user.getGroup().name  : null,
                  groupId: user.groupId,
                  streamUrl: "rtmp://"+config.wowza.ipAddress+":"+config.wowza.port+config.wowza.path+user.id+".stream"
              }
          }));
        }).error(function (err) {
          console.log(err);
          res.send(500);
        });
  });
});

app.get('/users', auth.ensureAdmin, function (req, res) {
  db.Group.find(req.user.groupId).success(function(group){
      var where = [],
          params = [],
          page = req.query.page || 0,
          pageSize = req.query.pageSize || 25,
          select = ['SELECT DISTINCT U.id, U.username, U.name, G.name as group FROM "users" U LEFT OUTER JOIN "groups" G ON U."groupId" = G.id'];

      if ( req.query.user ) {
        req.query.user = '%' + req.query.user + '%';
        where.push('(U.username LIKE ? OR U.name LIKE ?)');
        params.push(req.query.user);
        params.push(req.query.user);
      }

      if ( req.query.date ) {
        var date = moment(req.query.date);

        select.push('INNER JOIN "access_tokens" A ON U.id = A."userId"');
        where.push("date_trunc('day', A.\"createdAt\") = ?::date AND A.scope = 'client'");
        params.push(date.toDate());
      }


      if (group == null || group.isAdmin === true){
          if (req.query.group ) {
              where.push('G.name LIKE ?');
              params.push('%' + req.query.group + '%');
          }
      } else {
          where.push('G.id = ?');
          params.push(group.id);
      }

      var query = select.join(' ') + ((where.length > 0) ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY U.name';

      db.sequelize.query(query, null, { logging : console.log, raw : true }, params).success(function(result) {
        res.send(result);
      });
  });
});

app.post('/users', auth.ensureAdmin, function (req, res) {
  var user = db.User.build({
    username : req.body.username,
    email : req.body.email,
    name : req.body.name,
    groupId: req.body.groupId,
    isAdmin : req.body.isAdmin
  });

  user.hashPassword(req.body.password, function() {
    user.save().success(function() {
      res.send(202);
    }).error(function(err) {
      res.send(422, err);
    });
  });
});

app.post('/users/:id', auth.ensureAdmin, function(req,res) {
    db.Group.find(req.user.groupId).success(function(group){

        db.User.find(req.params.id).success(function(user) {
            if (group != null && group.isAdmin !== true && group.id != user.groupId){
                res.send(403);
            } else {
                user.updateAttributes(req.body).success(function(){
                    res.send(user);
                }).error(function(err) {
                    res.send(422, err);
                });
            }
        }).error(function(err) {
            res.send(500, err);
        });
    });
});

app.post('/users/:id/change-password', auth.ensureAdmin, function(req,res) {
    db.Group.find(req.user.groupId).success(function(group){
        db.User.find(req.params.id).success(function(user) {
            if (group != null && group.isAdmin !== true && group.id != user.groupId){
                res.send(403);
            } else {
                user.validatePassword(req.body.password.oldPassword, function(valid) {
                    if (!valid ) {
                        res.send(403, 'Invalid password');
                    }else{
                        user.hashPassword(req.body.password.newPassword, function() {
                            user.save().success(function() {
                                res.send(200);
                            }).error(function(err) {
                                res.send(422, err);
                            });
                        });
                    }
                });
            }
        }).error(function(err) {
            res.send(500, err);
        });
    });
});

app.get('/users/:id', auth.ensureAdmin, function(req,res) {
    db.Group.find(req.user.groupId).success(function(group){
        db.User.find(req.params.id).success(function(user) {
            if (group != null && group.isAdmin !== true && group.id != user.groupId){
                res.send(403);
            } else {
                res.send(user);
            }
        }).error(function(err) {
           res.send(500, err);
        });
    });
});

app.post('/users/:email/reset_password', function(req,res) {
    db.User.find({ where: { email:req.params.email } }).success(function(user) {
        if(!user) {
            return res.send(404, 'Email not found');
        }
        var randomString = Math.random().toString(36).slice(-8);
        sendEmail(req.params.email, randomString, user.username, function(success, errorMsg){
            if(!success){
                console.log(errorMsg);
                res.send(500, errorMsg);
            }
            user.hashPassword(randomString, function() {
                user.save().success(function() {
                    res.send(200);
                }).error(function(err) {
                    res.send(422, err);
                });
            });
        });
    }).error(function(err) {
        res.send(500, err);
    });
});

function sendEmail(email, password, username, callback){
    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            console.log(err);
            callback(false, err);
        } else {
            var locals = {
                email: email,
                username: username,
                password:password
            };
            template(config.email.template, locals, function(err, html, text) {
                if (err) {
                    console.log(err);
                    callback(false, err);
                } else {
                    if(smtpTransport){
                        smtpTransport.sendMail({
                            from: config.email.from,
                            to: locals.email,
                            subject: config.email.subject,
                            html: html
                        }, function(err, responseStatus) {
                            if (err) {
                                console.log(err);
                                callback(false, err);
                            } else {
                                console.log(responseStatus.message);
                                callback(true);
                            }
                        });
                    }else{
                        callback(false, 'problems with smtpTransport. returning HTTP 500');
                    }
                }
            });
        }
    });
}