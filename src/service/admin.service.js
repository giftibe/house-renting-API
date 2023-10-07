const Admin = require('../model/admin.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const generate_Template = require('../utils/template');
const Buyer = require('../model/buyer.model');
const Seller = require('../model/seller.model');
const { subject1, secret } = process.env



class AdminServices {
    async createAdmin(data) {
        try {
            const { email, password } = data;
            //check if email exist
            const existingUser = await Admin.find({ email: email }, { _id: 1, password: 0 })
            if (existingUser) {
                return res.send(Boom.conflict('Email already exists'))
            }

            //save to data
            await Admin.create({
                email: email,
                password: password
            })

            //send email to verify account
            generate_Template(email, secret)
            mailer({ subject: subject1, template: generate_Template, email: email })
            return res.status(201).send({
                message: MESSAGES.USER.CREATED,
                success: true,
            });
        }
        catch (error) {
            return res.send(Boom.conflict('there was a conflict' + error));
        }
    }


    async loginUser(data) {
        try {
            const { email, password } = data
            //check if the user email exists in db
            const findUser = await Admin.find({ email: email })


            if (!findUser) {
                return res.status(404).send({
                    message: "Email does not exit, register",
                    success: false
                })
            }

            //check if users' email is verified
            if (findUser.isVerified === false) {
                generate_Template(email, secret)
                mailer({ subject: subject1, template: generate_Template, email: email })
                return res.status(201).send({
                    message: 'MESSAGES.USER.VERIFY_EMAIL',
                    success: false,
                });
            }

            //compare passwords with jwt
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.WRONG_PASSWORD',
                    success: false,
                });
            }

            return res.status(200).send({
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
            })
        } catch (error) {
            return res.send(Boom.conflict('A conflict occured' + error));
        }
    }


    async getAUser(data) {
        try {
            const { id } = data
            const findUser = await Admin.find({ _id: id }, { _id: 1, password: 0 })
            if (!findUser) {
                return res.status(403).send({
                    message: 'No User Found',
                    success: false
                })
            }

            return res.status(200).send({
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                findUser
            })

        } catch (error) {
            return res.send(Boom.conflict('A conflict occured' + error));
        }
    }


    //@ find all buyers
    async getAllBuyers() {
        try {
            const User = await Buyer.find({}, { _id: 1, password: 0 })
            if (User.length === 0) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                })
            }

            return res.status(200).send({
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                User
            })

        } catch (error) {
            return res.send(Boom.badRequest('Bad Request' + error))
        }
    }


    //      @route  GET /api/v1/user/sellers
    //     @desc    find all sellers
    //     *  @access  Private
    async getAllSeller() {
        try {
            const User = await Seller.find({}, { _id: 1, password: 0 })
            if (User.length === 0) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                })
            }

            return res.status(200).send({
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                User
            })

        } catch (error) {
            return res.send(Boom.badRequest('Bad Request' + error))
        }
    }



    async getABuyer(data) {
        try {
            const { id } = data
            const User = await Buyer.find({ _id: id }, { _id: 1, password: 0 })
            if (!User) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                })
            }

            return res.status(200).send({
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                User
            })

        } catch (error) {
            return res.send(Boom.badRequest('Bad Request' + error))
        }
    }


    async getASeller(data) {
        try {
            const { id } = data
            const User = await Seller.find({ _id: id }, { _id: 1, password: 0 })
            if (!User) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                })
            }

            return res.status(200).send({
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                User
            })

        } catch (error) {
            return res.send(Boom.badRequest('Bad Request' + error))
        }
    }


    //update an Admin
    async updateAUser(req, res) {
        try {
            const { id } = req.params;
            const { firstName, lastName, mobile } = req.body;
            // Check if valid id

            const findUser = await Admin.find({ _id: id });
            if (findUser) {
                const updated = await Admin.update({ _id: id }, {
                    firstName: firstName,
                    lastName: lastName,
                    mobile: mobile
                });
                if (updated) {
                    return res.status(200).send({
                        message: 'MESSAGES.USER.ACCOUNT_UPDATED',
                        success: true,
                        updated,
                    });
                } else {
                    return res.status(409).send({
                        message: 'MESSAGES.USER.NOT_UPDATED',
                        success: false,
                    });
                }
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: MESSAGES.USER.ERROR + error.message,
                success: false,
            });
        }
    }


    //    @route   POST /api/v1/user/logout
    //     @desc    Handles user logout
    //     *  @access  Private

    async loggedOut() {
        try {
            const token = "";
            await res.cookie("token", token, { httpOnly: true });
            return res.status(200).send({
                message: 'MESSAGES.USER.LOGGEDOUT',
                token: token,
                success: true,
            });
        } catch (err) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + err,
                success: false,
            });
        }
    }


    //verify account
    //logout
\    //block an account
    //unblock an account

}

module.exports = AdminServices()