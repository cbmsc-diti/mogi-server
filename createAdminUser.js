var groupName = "Cape Town",
    admin = true,
    userName = 'admin',
    userEmail = 'user@email.com',
    userPass = 'admin'
    latitude = -33.920684,
    longitude = 18.425690;

var db = require('./lib/db');


group = db.Group.build({name: groupName, isAdmin: admin, lat: latitude, lng: longitude });
group.save().success(function(group){
    var user = db.User.build({
        username : userName,
        email : userEmail,
        name : userName,
        groupId: group.id,
        isAdmin : admin
    });

    user.hashPassword(userPass, function() {
        user.save();
    });
});




