const user = require('../model/user.model')
const House = require('../model/house.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const generate_Template = require('../utils/template');
const { subject1 } = process.env
const SECRET_KEY = process.env.SECRET_KEY
const path = require('path')
const { MESSAGES } = require('../config/config.constant')


class userServices {

    // @desc create a users account
    async createuser(data) {
        try {
            const { email, password } = data;

            //check if email exist
            const existingUser = await user.find({ email: email }, { _id: 1, password: 0 })
            if (existingUser.length !== 0) {
                return Boom.conflict(MESSAGES.USER.EMAIL_DUPLICATE)
            }

            //save to data
            await user.create({
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
            const template = generate_Template(Link, htmlFileDir)
            mailer(subject1, template, email)

            return MESSAGES.USER.CREATED

        }
        catch (error) {
            return Boom.conflict(MESSAGES.USER.ERROR + error);
        }
    }

    // @desc logs in a user
    async loginUser(data) {
        try {
            const { email } = data
            //check if the user email exists in db
            const findUser = await user.find({ email: email })


            if (!findUser) {
                return {
                    message: "Email does not exit, register",
                    success: false
                }
            }

            // check if users' email is verified
            if (findUser.isVerified === false) {
                const verification_Token = jwt.sign({ email }, SECRET_KEY, {
                    expiresIn: "30m",
                });
                const Link = `https://propell-ten.vercel.app/verifyMail/${encodeURIComponent(
                    verification_Token
                )}`;
                const htmlFileDir = path.join(__dirname, "../client/verify-1.html");

                //send email to verify account
                const template = generate_Template(Link, htmlFileDir)
                mailer(subject1, template, email)
                return {
                    message: 'MESSAGES.USER.VERIFY_EMAIL',
                    success: false,
                };
            }

            //compare passwords with jwt
            const isMatch = await bcrypt.compare(data.password, findUser.password);
            if (!isMatch) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.WRONG_PASSWORD',
                    success: false,
                });
            }

            const token = jwt.sign({ customUserId: findUser.customUserId }, SECRET_KEY);
            const { password, ...data } = findUser.toJSON();

            return {
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                data,
                token
            }
        } catch (error) {
            return Boom.conflict('A conflict occured' + error);
        }
    }



    // @desc  updates an user
    async updateAUser(customUserId, data) {
        try {
            // Check if valid id
            const findUser = await user.findById({ customUserId: customUserId });
            if (findUser) {
                const updated = await user.findByIdAndUpdate(
                    { customUserId: customUserId },
                    data);
                if (updated) {
                    return {
                        message: 'MESSAGES.USER.ACCOUNT_UPDATED',
                        success: true,
                        updated,
                    };
                } else {
                    return {
                        message: 'MESSAGES.USER.NOT_UPDATED',
                        success: false,
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                };
            }

        } catch (error) {
            return {
                message: 'MESSAGES.USER.ERROR' + error.message,
                success: false,
            };
        }
    }


    // @desc  sends reset password link to user email
    async sendUserResetPasswordLink(data) {
        try {
            //check if the email exist in the database
            const { email } = data;
            const userEmail = await user.find({ email: email });
            if (!userEmail) {
                return {
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                };
            }
            //if the email exists send
            const payload = {
                email: userEmail.email,
                customUserId: userEmail.customUserId,
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
                message: 'MESSAGES.USER.VERIFY_EMAIL_SENT',
            };
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            };
        }
    }


    // @desc confirm validity of reset password
    async checkUserResetPasswordLink(data) {
        try {
            const { customUserId, token } = data;
            //check if a user with the id exist in db
            const checkUser = await user.findById(
                { customUserId: customUserId }
            );
            if (!checkUser) {
                return {
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                    success: false,
                };
            }

            try {

                const isMatch = jwt.verify(token, SECRET_KEY);

                if (!isMatch) {
                    return {
                        message: "Invalid Link",
                        suucess: false
                    }
                }
                return {
                    message: 'MESSAGES.USER.VALID_LINK',
                    success: true,
                    isMatch
                };
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


    //     @desc    updates the password field
    async updateUserPassword(customUserId, data) {
        try {
            //check if  the email exist
            const userfound = await user.findById({ customUserId: customUserId });
            if (!userfound) {
                return {
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                };
            }
            //generate new password and update it
            await user.findByIdAndDelete(
                { customUserId: customUserId },
                { password: data.password });
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


    // @desc create a house post
    async postHouseAd(customUserId, data) {
        try {
            //user id
            let userFound = await user.findById({ customUserId: customUserId })

            if (!userFound) {
                return {
                    message: "You are not authorized to perform this action",
                    success: false
                }
            }
            const newHousePost = await House.create({
                user: customUserId,
                ...data
            })
            return {
                message: "House created successfully",
                success: true,
                newHousePost
            }

        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            }
        }
    }


    //  @desc   deletes my post
    async deleteHousePost(data) {
        try {
            //check if the house exist
            const { customHouseId } = data //house id
            const findHouse = await House.findById({ customHouseId: customHouseId })
            if (!findHouse) {
                return {
                    message: "No such House post exist",
                    success: false
                }
            }

            await House.findByIdAndDelete({ customHouseId: customHouseId })
            return {
                message: "Post successfully deleted",
                success: true
            }

        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            }
        }
    }


    // @desc     update my post
    async updateHousePost(customHouseId, data) {
        try {
            const findHouse = await House.findById({ customHouseId: customHouseId })
            if (!findHouse) {
                return {
                    message: "No such House post exist",
                    success: false
                }
            }
            const updatedHouse = await House.findOneAndUpdate({ customHouseId: customHouseId }, data)
            return {
                message: "House post updated successfully",
                success: true,
                updatedHouse
            }
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            }
        }
    }

    // @desc    gets all my House posted
    async getAllMyHouseAd(data) {
        try {
            const { customUserId } = data
            const getUser = await user.find({ customUserId: customUserId })
            if (!getUser) {
                return {
                    message: "User does not exist",
                    success: false,
                }
            }
            const houses = getUser.houses
            if (houses.length == 0) {
                return {
                    message: "You have no add posted",
                    success: false
                }
            }
            return {
                message: "Houses found",
                success: true,
                houses
            }

        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            }
        }
    }



    // @desc adds houses to saved for later section
    async savedForLater(data) {
        try {
            const { customUserId, customHouseId } = data
            //Check the house exists
            const findHouse = await House.findById({ customHouseId: customHouseId })
            if (!findHouse) {
                return {
                    message: "House does not exist",
                    success: false
                }
            }
            //check if the user exist
            const checkUser = await user.findById({ _id: customUserId })
            if (!checkUser) {
                return {
                    message: "user doesn't exist",
                    success: false
                }
            }

            //if user exist get the savedItem section
            let savedItems = checkUser.savedItem;
            const saved = savedItems.unshift(customHouseId)
            if (!saved) {
                return {
                    message: "item not saved",
                    success: false
                }
            }
            return {
                message: 'Item saved for later',
                success: true,
                findHouse
            }
        } catch (error) {
            return {
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            };
        }
    }
}

module.exports = new userServices()