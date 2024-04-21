const express = require('express');
const router = express.Router();
const controller = require('../controllers/pantryControllers.js');
const {login} = require('../auth/auth') 
const { verify } = require('../auth/auth');
const { requireRole} = require('../auth/auth');

router.get("/", verify, controller.landing_page);
router.get('/allItems', verify, controller.items_list);
router.get('/newItem', verify, requireRole(['admin', 'user']),controller.new_item);
router.post('/newItem', verify, requireRole(['admin', 'user']),controller.post_new_item);
router.get('/about', verify, controller.show_about_page);
router.get('/ContactUs', verify, controller.show_contact_page);
router.get('/register', controller.show_register_page); 
router.post('/register', controller.post_new_user); 
router.get('/login', controller.show_login_page);
router.post('/login', login, controller.handle_login);
router.get("/loggedIn",verify, controller.loggedIn_landing);
router.get("/logout",verify, controller.logout);
//admin routes
router.get('/adminDashboard', verify,  controller.admin_dashboard);
router.get('/admin/users', verify,  controller.edit_users);
router.get('/admin/items', verify, controller.edit_items);
router.get('/admin/users/update/:name', verify, requireRole('admin'), controller.show_update_user_form);
router.post('/admin/users/update/:name', verify, requireRole('admin'), controller.update_user);
router.post('/admin/users/delete/:name', verify, requireRole('admin'), controller.delete_user);
router.get('/admin/items/update/:food', verify, requireRole('admin'), controller.show_update_item_form);
router.post('/admin/items/update/:food', verify, requireRole('admin'), controller.update_item);
router.post('/admin/items/delete/:food', verify, requireRole('admin'), controller.delete_item);
router.get('/admin/users/create', verify, requireRole('admin'), controller.show_create_user_form);
router.post('/admin/users/create',verify, requireRole('admin'), controller.create_user);

router.post('/selectItem/:food', verify, requireRole('pantry'), controller.select_item);
router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})
router.use(function(err, req, res, next) {
    if (!res.headersSent) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server Error.');
    } else {
        console.error(err);
        next(err);
    }
});
module.exports = router;