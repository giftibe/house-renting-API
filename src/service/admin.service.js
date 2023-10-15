const Admin = require('../model/admin.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const generate_Template = require('../utils/template');
const user = require('../model/user.model');
const { subject1, SECRET_KEY } = process.env


class AdminServices {

    // @desc create a admin account#

    async createAdmin(data) {
        try {
            const { email, password } = data;
            //check if email exist
            const existingUser = await Admin.find({ email: email }, { _id: 1, password: 0 })
            if (existingUser.length !== 0) {
                return Boom.conflict('Email already exists')
            }

            //save to data
            await Admin.create({
                email: email,
                password: password
            })
            const verification_Token = jwt.sign({ email }, SECRET_KEY, {
                expiresIn: "30m",
            });
            const Link = `https://propell-ten.vercel.app/verifyMail/${encodeURIComponent(
                verification_Token
            )}`;
            const htmlFileDir = path.join(__dirname, "../client/verify-1.html");

            //send email to verify account
            // using nodemailer to send the email
            generate_Template(Link, htmlFileDir)
            mailer({ subject: subject1, template: generate_Template, email: email })

            return {
                message: "MESSAGES.USER.CREATED",
                success: true,
            };
        }
        catch (error) {
            return Boom.conflict('there was a conflict' + error);
        }
    }


    // @desc logs in an admin#
    async loginAdmin(adminData) {
        try {
            const email = adminData.email;
            //check if the user email exists in db
            const findUser = await Admin.findOne({ email: email })

            if (!findUser) {
                return {
                    message: "Email does not exit, register",
                    success: false
                }
            }

            //check if users' email is verified
            // if (findUser.isVerified === false) {
            //     const verification_Token = jwt.sign({ email }, SECRET_KEY, {
            //         expiresIn: "30m",
            //     });
            //     const Link = `https://propell-ten.vercel.app/verifyMail/${encodeURIComponent(
            //         verification_Token
            //     )}`;
            //     const htmlFileDir = path.join(__dirname, "../client/verify-1.html");

            //     //send email to verify account
            //     generate_Template(Link, htmlFileDir)
            //     mailer({ subject: subject1, template: generate_Template, email: email })
            //     return {
            //         message: 'MESSAGES.USER.VERIFY_EMAIL',
            //         success: false,
            //     };
            // }

            //compare passwords with jwt
            const inputPassword = adminData.password
            const isMatch = await bcrypt.compare(inputPassword, findUser.password);
            if (!isMatch) {
                return {
                    message: 'MESSAGES.USER.WRONG_PASSWORD',
                    success: false,
                };
            }
            const token = jwt.sign({ _id: findUser.id }, SECRET_KEY);
            const { password, ...adminDetails } = findUser.toJSON();

            return {
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                adminDetails,
                token
            }
        } catch (error) {
            return Boom.conflict('A conflict occured' + error);
        }
    }


    //get an admin#
    async getAnAdmin(data) {
        try {
            const { customAdminId } = data
            const findUser = await Admin.findOne({ customAdminId: customAdminId }, { _id: 1, password: 0 })
            if (!findUser) {
                return {
                    message: 'No User Found',
                    success: false
                }
            }

            return {
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                findUser
            }

        } catch (error) {
            return Boom.conflict('A conflict occured' + error);
        }
    }



    //get an admin#
    async getAllUser() {
        try {
            const findUser = await user.find({}, { _id: 1, password: 0 })

            if (!findUser) {
                return {
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                }
            }

            return {
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                findUser
            }

        } catch (error) {
            return {
                success: false,
                message: "An error occured ", error
            }
        }
    }


    //gets a user#
    async getAUser(data) {
        try {
            const { customUserId } = data
            const User = await user.findOne(
                { customUserId: customUserId },
                { _id: 1, password: 0 }
            )
            if (!User) {
                return {
                    message: 'MESSAGES.USER.NO_USER',
                    success: false,
                }
            }

            return {
                message: 'MESSAGES.USER.USER_FOUND',
                success: true,
                User
            }

        } catch (error) {
            return Boom.badRequest('Bad Request' + error)
        }
    }


    //update an Admin#
    async updateAdmin(customAdminId, data) {
        try {
            // Check if valid id
            const findAdmin = await Admin.findOne({ customAdminId: customAdminId });

            if (!findAdmin) {
                return {
                    success: false,
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                }
            }

            const updated = await Admin.findOneAndUpdate(
                { customAdminId: customAdminId },
                { ...data },
                { new: true }
            ).select({ _id: 1, password: 0 });

            if (!updated) {
                return {
                    message: 'MESSAGES.USER.NOT_UPDATED',
                    success: false,
                }
            }
            return {
                message: 'MESSAGES.USER.ACCOUNT_UPDATED',
                success: true,
                updated,
            }
        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error.message,
                success: false,
            };
        }
    }


    //    @route   POST /api/v1/admin/reset-password
    //     @desc    Sends reset password link via mail
    //     *  @access  Public

    async sendAdminResetPasswordLink(data) {
        try {
            //check if the email exist in the database
            const { email } = data;
            const userEmail = await Admin.find({ email: email });
            if (!userEmail) {
                return {
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                };
            }
            //if the email exists send
            const payload = {
                email: userEmail.email,
                customAdminId: userEmail.customAdminId,
                password: userEmail.password
            };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
            const Link = `https://propell-ten.vercel.app/user/reset-password/${encodeURIComponent(
                userEmail.id
            )}/${encodeURIComponent(token)}`;

            //email sending
            const htmlFileDir = path.join(__dirname, "../client/password.html");
            const subject2 = "Reset Password";

            // using nodemailer to send the email
            generate_Template(Link, htmlFileDir)
            mailer({ subject: subject2, template: generate_Template, email: email })

            return {
                success: true,
                message: 'MESSAGES.USER.EMAIL_SENT',
            };
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            };
        }
    }


    //      @route  GET /api/v1/user/reset-password/:id/:token
    //     @desc  Verifies link sent to the email checking the token and if the user exists using their ID
    //     *  @access  Unique

    async checkAdminResetPasswordLink(data) {
        try {
            const { customAdminId, token } = data;
            //check if a user with the id exist in db
            const checkUser = await Admin.findOne({ customAdminId: customAdminId });
            if (!checkUser) {
                return {
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                    success: false,
                }
            }

            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                const isMatch = await bcrypt.compare(decoded.password, checkUser.password);
                if (!decoded || !isMatch) {
                    return {
                        message: 'MESSAGES.USER.VALID_LINK',
                        success: true,
                    };
                }

            } catch (error) {
                return {
                    message: 'MESSAGES.USER.INVALID_LINK' + error,
                    success: false,
                };
            }
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            };
        }
    }

    //      @route  PATCH /api/v1/user/setpassword/:id
    //     @desc    updates the password field
    //     *  @access  Private

    async updatePassword(customAdminId, data) {
        try {
            //check if  the email exist
            const { password } = data;

            const userfound = await Admin.findOne({
                customAdminId: customAdminId
            });
            if (!userfound) {
                return {
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                };
            }
            //generate new password and update it
            await Admin.findOneAndDelete({ customAdminId: customAdminId }, { password: password });
            return {
                message: 'MESSAGES.USER.PASSWORD_UPDATED',
                success: true,
            };
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            };
        }
    }
}

module.exports = new AdminServices()