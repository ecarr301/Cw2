const nedb = require('gray-nedb');
class Items{
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
            console.log('DB');
        }
    }
    init(){
        this.db.insert({
            food: 'Red Apples',
            quantity: 4,
            expiry: new Date('2024-05-01'),
            selected: false,
            
        });
        this.db.insert({
            food: 'Green Grapes',
            quantity: 3,
            expiry: new Date('2024-05-15'),
            selected: false,
            
        });
        this.db.insert({
            food: 'Blueberries',
            quantity: 2,
            expiry: new Date('2024-04-01'),
            selected: false,
            
        });
        this.db.insert({
            
            food: 'Whole Wheat Bread',
            quantity: 1,
            expiry: new Date('2024-04-25'),
            selected: false,
            
        });
        this.db.insert({
            
            food: 'Almond Milk',
            quantity: 5,
            expiry: new Date('2024-06-02'),
            selected: true
        });
        this.db.insert({
            
            food: 'Brown Eggs',
            quantity: 12,
            expiry: new Date('2024-05-20'),
            selected: false
        });
        console.log('Items added to database');
    }

    getAllItems() {

        return new Promise((resolve, reject) => {
            const currentDate = new Date();


        this.db.find({selected : false, expiry: { $gt: currentDate }  }, function(err, items) {

        if (err) {
        reject(err);

        } else {
        resolve(items);
        }
        })
        })
        }

        getAllItemsAdmin() {

            return new Promise((resolve, reject) => {
            
            this.db.find({}, function(err, items) {

            if (err) {
            reject(err);

            } else {
            resolve(items);
            }
            })
            })
            }

        
            
            addItem(userId, food, quantity, expiry) {
                var item = {
                
                food: food,
                quantity: quantity,
                expiry: new Date(expiry),
                selected: false 
                }
                console.log('entry created', item);
                this.db.insert(item, function(err, doc) {
                if (err) {
                console.log('Error inserting document', food, err);
                } else {
                console.log('document inserted into the database', doc);
                }
                })
                }

                selectItem(food, callback) {
                this.db.update({ food: food }, { $set: { selected: true } }, {}, function(err, numUpdated) {
                if (err) {
                 callback(err, null);
                } else {
                callback(null, numUpdated > 0);
                 }
                });
                }


                lookup(item, callback) {
                    this.db.find({ food: item }, function(err, entries) {
                        if (err) {
                            console.error("Database error during item lookup:", err);
                            return callback(err); 
                        }
                        if (entries.length === 0) {
                            console.log("No item found for:", item);
                            return callback(null, null); 
                        }
                        return callback(null, entries[0]);  
                    });
                }

                updateItem(food, updateData, callback) {
                    this.db.update({ food: food }, { $set: updateData }, {}, function(err, numUpdated) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, numUpdated > 0);
                        }
                    });
                }

                deleteItem(food, callback) {
                    console.log("In model");
                    this.db.remove({ food: food }, {}, function(err, numRemoved) {
                        if (err) {
                            console.error("Database error during item deletion:", err);
                            return callback(err);
                        }
                        console.log("Deleted", numRemoved, "item(s)");
                        callback(null);
                    });
                }
                
}

module.exports = Items;