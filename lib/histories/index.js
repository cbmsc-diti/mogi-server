var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    auth = require('./../auth'),
    _ = require('lodash'),
    config = require('./../config');

app.post('/histories', auth.ensureToken, function(req,res) {
    if ( !(req.body instanceof Array) ) {
        var history = db.History.build({
            previousState: req.body.previousState,
            nextState: req.body.nextState,
            date: req.body.date
        });

        history.save().success(function () {
            history.setUser(req.user);
        });
        res.send(200);
    } else {

        _.forEach(req.body, function(hist) {
            hist.userId = req.user.id;
        });

        db.History.bulkCreate(req.body)
            .success(function(result) {
                res.send(200);
            }).error(function(err) {
                console.log(err);
                res.send(500);
            });
    }
});

app.post('/histories/:user', auth.ensureToken, function(req,res) {
    db.User.find({where: {username: req.params.user}}).success(function(user){
        _.forEach(req.body, function(hist) {
            hist.userId = user.id;
        });

        db.History.bulkCreate(req.body)
            .success(function(result) {
                res.send(200);
            }).error(function(err) {
                console.log(err);
                res.send(500);
            });
    });
});

