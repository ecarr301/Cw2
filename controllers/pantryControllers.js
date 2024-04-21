const itemsDAO = require('../models/itemsModel');
const userDAO =require('../models/userModel');
const db = new itemsDAO();

db.init();

exports.show_register_page = function(req, res) {
    res.render("user/register");
    } 


exports.post_new_user = function (req, res) {
    const user = req.body.username;
    const password = req.body.pass;
    const role = 'user';
    if (!user || !password) {
      res.send(401, "no user or no password");
      return;
    }
    userDAO.lookup(user, function (err, u) {
      if (u) {
        res.send(401, "User exists:", user);
        return;
      }
      userDAO.create(user, password, role);
      console.log("register user", user, "password", password, "role", role);
      res.redirect("/login");
    });
  };

  exports.show_login_page = function(req, res) {
    res.render("user/login");
    }; 

    exports.handle_login = function (req, res) {
        res.redirect('/');
        }; 
        exports.loggedIn_landing = function (req, res) {
            db.getAllEntries()
              .then((list) => {
                res.render("items", {
                  title: "title",
                  user: 'user',
                  items: list,
                });
              })
              .catch((err) => {
                console.log("promise rejected", err);
              });
          };
        exports.logout = function (req, res) {
            res.clearCookie("jwt").status(200).redirect("/");
          };
          
          
          exports.edit_users = function(req, res) {
            userDAO.getAllUsers()
              .then((list) => {
                  console.log(list); 
                  res.render("admin/editUsers", {
                      'title': 'Users',
                      'users': list
                  });
              })
              .catch(err => {
                  console.error('Error loading users:', err);
              });
        };
        

        exports.show_update_user_form = function(req, res) {
          const username = req.params.name;
          console.log(username);
          userDAO.lookup(username, function(err, user) {
              if (err) {
                  res.status(500).send("Server error retrieving user details.");
              } else if (!user) {
                  res.status(404).send("User not found.");
              } else {
                  res.render('admin/updateUser', {
                      title: 'Edit User',
                      action: '/admin/users/update/' + username, 
                      method: 'POST',
                      user: user,
                      isAdmin: user.role === 'admin',
                      isUser: user.role === 'user',
                      isPantry: user.role === 'pantry'
                  });
              }
          });
      };
      
        
        
      exports.update_user = function(req, res) {
        const username = req.params.name; 
        const { name, password, role } = req.body; 
    
        console.log('Received update request for:', username);
        console.log('Form data received:', req.body);
    
        const updatedData = { name, role };
    
        if (password) {
            bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
                if (err) {
                    console.error("Error hashing password:", err);
                    return res.status(500).send("Error hashing password.");
                }
                updatedData.password = hashedPassword;
                updateUser(updatedData);
            });
        } else {
            updateUser(updatedData);
        }
    
        function updateUser(updatedData) {
            console.log('Updating user with:', updatedData);
            userDAO.updateUser(username, updatedData, function(err) {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).send("Error updating user.");
                }
                res.redirect('/admin/users');
            });
        }
    };

 
exports.delete_user = function(req, res) {
  const username = req.params.name;
  console.log("trying to delete");
  
  userDAO.deleteUser(username, function(err) {
      if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).send("Error deleting user.");
      }
      console.log('Deleted user:', username);
      res.redirect('/admin/users'); 
  });
};

    
        
    
       
exports.update_item = function(req, res) {
  const food = req.params.food;
  const { quantity, expiry } = req.body;
  console.log('Received data for update:', { food, quantity, expiry });
  if (!food) {
    console.error("No food specified for update.");
    return res.status(400).send("Request must include item identifier.");
}
  db.updateItem(food, { quantity, expiry }, function(err) {
      if (err) {
          console.error("Error updating item:", err);
          return res.status(500).send("Error updating item.");
      }
      console.log('Updated item:', food);
      res.redirect('/admin/items'); 
  });
};

exports.delete_item = function(req, res) {
  const food = req.params.food;
  
  db.deleteItem(food, function(err) {
      if (err) {
          console.error("Error deleting food:", err);
          return res.status(500).send("Error deleting food.");
      }
      console.log('Deleted item:', food);
      res.redirect('/admin/items'); 
  });
};
        
exports.create_user = function(req, res) {
  const { username, password, role } = req.body;
  if (!username || !password) {
      res.status(400).send("Username and password are required.");
      return;
  }
  userDAO.lookup(username, function(err, user) {
      if (user) {
          res.status(409).send("User already exists.");
          return;
      }
      userDAO.create(username, password, role)
      console.log("register user", user, "password", password, "role", role)
          
          res.redirect('/admin/users');
      });
  }; 
                       
exports.show_create_user_form = function(req, res) {
  res.render('admin/createUser', {
      title: 'Create New User'
  });
};
              
        
       



    exports.landing_page = function(req, res) {
        res.render("home", {
        'title': 'Scottish Pantry Network',
        });
        }
exports.users_items = function(req, res) {
    res.render("items", {
'title': 'Guest Book'
});
    }


    exports.new_item = function(req, res) {
        res.render('newItems', {
        'title': 'Scottish Pantry Network'
        })
        }

        

        exports.post_new_item = function(req, res) {
            console.log('Received body:', req.body);  
            if (!req.body.userId) {
                res.status(400).send("Items must have a user.");
                return;
            }
            console.log('Adding item:', req.body);
            db.addItem(req.body.userId, req.body.food, req.body.quantity, req.body.expiry)
            
              res.redirect('/');
          
        }
        exports.select_item = function(req, res) {
          const food = req.params.food;
          console.log(food);
          db.selectItem(food, function(err, success) {
              if (err) {
                  res.status(500).send("Error selecting item: " + err);
                  return;
              }
              if (success) {
                  res.redirect('/allItems');
              } else {
                  res.status(404).send("Item not found");
              }
          });
      };
      
        
exports.show_about_page = function(req, res) {
    res.render('about');
  };
  exports.show_contact_page = function(req, res) {
    res.render('contactUs');
  };

  exports.admin_dashboard = function(req, res){
    res.render('admin/adminDashboard');
  };

  


  exports.items_list = function(req, res) {
    db.getAllItems()
    .then((list)=> {
      res.render('items', {
        'title': 'Scotish Pantry',
        'items': list
      });
      console.log('Items fetched:', list);
      console.log('promise resolved');
    })
    .catch((err) => {
    console.log('promise rejected', err);
    })
  }



  exports.edit_items = function(req, res) {
    db.getAllItemsAdmin()
       .then((list) => {
           res.render("admin/editItems", {
               'title': 'Edit Items',
               'items': list
           });
       })
       .catch(err => {
           console.error('Error loading items:', err);
           res.status(500).send('Internal Server Error.');
       });
};



 exports.show_update_item_form = function(req, res) {
  const food = req.params.food;
  db.lookup(food, function(err, item) {
      if (err) {
          console.error("Server error retrieving item details:", err);
          return res.status(500).send("Server error.");
      } 
      if (!item) {
          return res.status(404).send("Item not found.");
      }
      res.render('admin/updateItem', {
          title: 'Edit Item',
          action: '/admin/items/update/' + food,
          item: item
      });
  });
};


