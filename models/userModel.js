const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Users{
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath,
            autoload: true });
        } else {
            //in memory
            this.db = new Datastore();
        }
    }
    
    init() {
        const users = [
            { name: 'Eamon', password: 'password', role: 'user' },
            { name: 'Admin', password: 'adminpassword', role: 'admin' }, 
            {name: 'Glasgow', password: 'glasgowpassword', role: 'pantry'}
        ];
    
        users.forEach((user) => {
            bcrypt.hash(user.password, saltRounds).then((hash) => {
                this.db.insert({
                    name: user.name,
                    password: hash,
                    role: user.role
                
                });
            });
        });
    
        return this; 
    }
    
    create(username, password, role = 'user') {
        bcrypt.hash(password, saltRounds).then((hash) => {
            this.db.insert({
                name: username,
                password: hash,
                role: role
            });
        });
    }
    lookup(username, callback) {
        this.db.find({ name: username }, function(err, entries) {
            if (err) {
                console.error("Database error during user lookup:", err);
                return callback(err);
            }
            if (entries.length === 0) {
                console.log("No user found for:", username);
                return callback(null, null); 
            }
            return callback(null, entries[0]); 
        });
    }
    
    // In your userModel.js
deleteUser(username, callback) {
    console.log("In model");
    this.db.remove({ name: username }, {}, function(err, numRemoved) {
        if (err) {
            console.error("Database error during user deletion:", err);
            return callback(err);
        }
        console.log("Deleted", numRemoved, "user(s)");
        callback(null);
    });
}

    getAllUsers() {
       
        return new Promise((resolve, reject) => {
        
        this.db.find({}, function(err, users) {
        
        if (err) {
        reject(err);
     
        } else {
        resolve(users);

        console.log('function all() returns: ', users);
        }
        })
        })
        }

        updateUser(currentUsername, updateData, callback) {
            this.db.update({ name: currentUsername }, { $set: updateData }, {}, callback);
        }
        
        
    
        
}
const dao = new Users();
dao.init();

module.exports = dao;