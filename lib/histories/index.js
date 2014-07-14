var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    auth = require('./../auth'),
    config = require('./../config');

app.post('/histories', auth.ensureToken, function(req,res) {
    var history = db.History.build({
        previousState: req.body.previousState,
        nextState: req.body.nextState
    });

    history.save().success(function(){
        history.setUser(req.user);
    });
    res.send(200);
});

