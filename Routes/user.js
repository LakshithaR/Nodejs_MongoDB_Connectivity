const express=require('express');

const router=express.Router();

const async_handler=require('../Middleware/async_handler');

const authentication_middleware=require('../Middleware/authentication');

const basic_auth = require('../Middleware/basic_auth');

const {
    CreateUser,
    getallusers,
    getuserbyid,
    getuserbyname,
    updateUserById,
    DeleteUserById,
    login
} = require('../Controller/user');

router.route('/create').post(basic_auth,async_handler(CreateUser));

router.route('/login').post(basic_auth,async_handler(login));

router.route('/getallusers').get(authentication_middleware,async_handler(getallusers));
// router.route('/getallusers').get(async_handler(getallusers));


router.route('/getuserbyid/:id').post(authentication_middleware,async_handler(getuserbyid));

router.route('/getuserbyname/:name').post(authentication_middleware,async_handler(getuserbyname));

router.route('/updateUserById/:id').patch(authentication_middleware,async_handler(updateUserById));

router.route('/deleteuserbyId/:id').delete(authentication_middleware,async_handler(DeleteUserById));

module.exports=router;

