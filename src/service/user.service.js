const user = require('../model/user.model')
const House = require('../model/house.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generate_Template = require('../utils/template');
const { subject1 } = process.env
const SECRET_KEY = process.env.SECRET_KEY
const path = require('path')
const { MESSAGES } = require('../config/config.constant')
const PORT = process.env.PORT



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
                expiresIn: "5m",
            });
            const Link = `https://localhost:${encodeURIComponent(PORT)}/api/v1/verifyMail/${encodeURIComponent(
                verification_Token
            )}`;
            const htmlFileDir = path.join(__dirname, "../client/verify-1.html");

            //send email to verify account
            const template = generate_Template(Link, htmlFileDir)
            mailer(subject1, template, email)

            return MESSAGES.USER.CREATED

        }
        catch (error) {
            return Boom.conflict(MESSAGES.USER.ERROR + error);
        }
    }

    
    //     @desc    to validate the admin email
    async verifyEmail(data) {
        try {
            const { token } = data;
            const decoded = jwt.verify(token, SECRET_KEY);

            if (!decoded) {
                return {
                    message: MESSAGES.USER.EMAIL_VER_FAILED,
                    success: false,
                };
            }

            // Update the user's verification status to true
            const { email } = decoded;

            // Find the user by email
            const verifiedUser = await user.findOne({ email });

            if (!verifiedUser) {
                return {
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                    success: false,
                };
            }

            // Update the isVerified field in the database
            const updateResult = await user.updateOne(
                { _id: verifiedUser._id },
                { isVerified: true }
            );
            // Check if the update was successful
            if (updateResult.modifiedCount === 1) {
                // Send a welcome email
                const templateFileDir = path.join(
                    __dirname,
                    "../client/welcome-1.html"
                );
                const template = fs.readFileSync(templateFileDir, "utf8");
                const subject = "Welcome";
                mailer(subject, template, email);

                return {
                    message: 'MESSAGES.USER.EMAIL_VERIFIED',
                    success: true,
                };
            }

            return {
                message:' MESSAGES.USER.EMAIL_NOT_VERIFIED',
                success: false,
            };

        } catch (error) {
            return {
                message: 'MESSAGES.USER.INVALID_TOKEN',
                success: false,
            };
        }
    }


    // @desc logs in a user#
    async loginUser(userData) { // Change the parameter name to 'userData'
        try {
            const email = userData.email;

            //check if the user email exists in db
            const findUser = await user.findOne({ email: email })
            if (!findUser) {
                return {
                    message: "Email does not exit, register",
                    success: false
                }
            }


            // @ To check if users' email is verified and authorize them

            if (findUser.isVerified === false) {
                const verification_Token = jwt.sign({ email }, SECRET_KEY, {
                    expiresIn: "10m",
                });
                const Link = `https://localhost:${encodeURIComponent(PORT)}/api/v1/verifyMail/${encodeURIComponent(
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
            const inputPassword = userData.password
            const isMatch = await bcrypt.compare(inputPassword, findUser.password);
            if (!isMatch) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.WRONG_PASSWORD',
                    success: false,
                });
            }

            const token = jwt.sign({ _id: findUser.id }, SECRET_KEY);
            const { password, ...userDetails } = findUser.toJSON();

            return {
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                userDetails,
                token
            }
        } catch (error) {
            return Boom.conflict('A conflict occured' + error);
        }
    }



    // @desc  updates an user#
    async updateAUser(customUserId, data) {
        try {
            // Check if valid id
            const findUser = await user.findOne({ customUserId: customUserId });
            if (findUser) {
                const updated = await user.findOneAndUpdate(
                    { customUserId: customUserId }, // Use the ObjectId
                    data,
                    { new: true } // To return the updated document
                );
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
                message: 'MESSAGES.USER.ERROR ' + error,
                success: false,
            };
        }
    }



    // @desc  sends reset password link to user email#
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

            const userID = userEmail[0].customUserId
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5m" });
            const Link = `https://localhost:${encodeURIComponent(PORT)}/api/v1/user/resetpassword/${encodeURIComponent(
                userID
            )}/${encodeURIComponent(token)}`;

            //email sending
            const htmlFileDir = path.join(__dirname, "../client/password.html");
            const subject2 = "Reset Password";

            // using nodemailer to send the email
            const template = generate_Template(Link, htmlFileDir)
            mailer(subject2, template, email)

            return {
                success: true,
                message: MESSAGES.USER.RESET_PASSWORD_LINK_SENT,
            };
        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error,
                success: false,
            };
        }
    }


    // @desc confirm validity of reset password#
    async checkUserResetPasswordLink(data) {
        try {
            const { customUserId, token } = data;
            //check if a user with the id exist in db
            const checkUser = await user.find(
                { customUserId: customUserId }
            );
            if (!checkUser) {
                return {
                    message: MESSAGES.USER.ACCOUNT_NOT_REGISTERED,
                    success: false,
                };
            }


            try {
                const isMatch = jwt.verify(token, SECRET_KEY);
                if (!isMatch) {
                    return {
                        message: MESSAGES.USER.INVALID_LINK,
                        suucess: false
                    }
                }
                return {
                    message: MESSAGES.USER.VALID_LINK,
                    success: true,
                    isMatch
                };
            } catch (error) {
                return {
                    message: MESSAGES.USER.INVALID_LINK + error,
                    success: false,
                };
            }
        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error,
                success: false,
            };
        }
    }


    //     @desc    updates the password field#
    async updateUserPassword(customUserId, data) {
        try {
            //check if  the email exist
            const { password } = data
            const userfound = await user.findOne({ customUserId: customUserId });
            if (!userfound) {
                return {
                    message: MESSAGES.USER.ACCOUNT_NOT_REGISTERED,
                    success: false,
                };
            }
            //generate new password and update it
            await user.findOneAndUpdate(
                { customUserId: customUserId },
                { password: password });
            return {
                message: MESSAGES.USER.PASSWORD_UPDATED,
                success: true,
            };
        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error,
                success: false,
            };
        }
    }


    // @desc create a house post#
    async postHouseAd(customUserId, data) {
        try {
            //user id
            let userFound = await user.findOne({ customUserId: customUserId })

            if (!userFound) {
                return {
                    message: "You are not authorized to perform this action. check ID",
                    success: false
                }
            }
            const newHousePost = await House.create({
                user: userFound._id,
                ...data
            })
            await user.findOneAndUpdate(
                { customUserId: customUserId },
                { $push: { houseAds: newHousePost._id } }
            );

            return {
                message: "House created successfully",
                success: true,
                newHousePost
            }

        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error,
                success: false,
            }
        }
    }


    //  @desc  deletes my post#
    async deleteHousePost(data) {
        try {
            //check if the house exist
            const { customHouseId } = data //house id
            const findHouse = await House.findOne({ customHouseId: customHouseId })
            if (!findHouse) {
                return {
                    message: "No such House post exist",
                    success: false
                }
            }

            await House.findOneAndDelete({ customHouseId: customHouseId })
            // also delete the id from the users houseAds
            await user.findByIdAndUpdate(
                { _id: findHouse.user },
                { $pull: { houseAds: findHouse.id } }
            )

            return {
                message: "Post successfully deleted",
                success: true
            }

        } catch (error) {
            return {
                message: MESSAGES.USER.ERROR + error,
                success: false,
            }
        }
    }


    // @desc     update my post#
    async updateHousePost(customHouseId, data) {
        try {
            const findHouse = await House.findOne({ customHouseId: customHouseId })
            if (!findHouse) {
                return {
                    message: "No such House post exist",
                    success: false
                }
            }
            const updatedHouse = await House.findOneAndUpdate(
                { customHouseId: customHouseId },
                data,
                { new: true })
            return {
                message: "House post updated successfully",
                success: true,
                updatedHouse
            }
        } catch (error) {
            return {
                message: MESSAGES.USER.SERROR + error,
                success: false,
            }
        }
    }

    // @desc    gets all my House posted#
    async getAllMyHouseAd(data) {
        try {
            const { customUserId } = data
            // const getUser = await user.find(
            //     { customUserId: customUserId }
            // )

            const getUser = await user
                .findOne({ customUserId: customUserId })
                .populate({
                    path: 'houseAds',
                    model: House
                });

            if (!getUser) {
                return {
                    message: "User does not exist",
                    success: false,
                }
            }

            const houses = getUser.houseAds
            // console.log(houses);
            if (houses.length == 0) {
                return {
                    message: "You have no ad posted",
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
                message: MESSAGES.USER.ERROR + error,
                success: false,
            }
        }
    }



    // @desc adds houses to saved for later section
    async savedForLater(data) {
        try {
            const { customUserId, HouseId } = data
            //Check the house exists
            const findHouse = await House.findById({ _id: HouseId })
            if (!findHouse) {
                return {
                    message: "House does not exist",
                    success: false
                }
            }

            //check if the user exist
            const checkUser = await user.findOne({ customUserId: customUserId })
            if (!checkUser) {
                return {
                    message: "user doesn't exist",
                    success: false
                }
            }

            //if user exist get the savedItem section
            const saved = await user.findOneAndUpdate(
                { customUserId: customUserId },
                { $push: { savedItem: HouseId } }
            );

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
                message: MESSAGES.USER.ERROR + error,
                success: false,
            };
        }
    }
}

module.exports = new userServices()