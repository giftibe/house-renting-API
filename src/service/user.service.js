const user = require('../model/user.model')
const House = require('../model/house.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const generate_Template = require('../utils/template');
const { subject1, secret } = process.env


class userServices {
    async createuser(data) {
        try {
            const { email, password } = data;
            //check if email exist
            const existingUser = await user.find({ email: email }, { _id: 1, password: 0 })
            if (existingUser) {
                return res.send(Boom.conflict('Email already exists'))
            }

            //save to data
            await user.create({
                email: email,
                password: password
            })
            const verification_Token = jwt.sign({ email }, secret, {
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
            const { email } = data
            //check if the user email exists in db
            const findUser = await user.find({ email: email })


            if (!findUser) {
                return res.status(404).send({
                    message: "Email does not exit, register",
                    success: false
                })
            }

            //check if users' email is verified
            if (findUser.isVerified === false) {
                const verification_Token = jwt.sign({ email }, secret, {
                    expiresIn: "30m",
                });
                const Link = `https://propell-ten.vercel.app/verifyMail/${encodeURIComponent(
                    verification_Token
                )}`;
                const htmlFileDir = path.join(__dirname, "../client/verify-1.html");

                //send email to verify account
                generate_Template(Link, htmlFileDir)
                mailer({ subject: subject1, template: generate_Template, email: email })
                return res.status(201).send({
                    message: 'MESSAGES.USER.VERIFY_EMAIL',
                    success: false,
                });
            }

            //compare passwords with jwt
            const isMatch = await bcrypt.compare(data.password, findUser.password);
            if (!isMatch) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.WRONG_PASSWORD',
                    success: false,
                });
            }
            const { password, ...data } = findUser.toJSON();

            return res.status(200).send({
                message: 'MESSAGES.USER_LOGGEDIN',
                success: true,
                data
            })
        } catch (error) {
            return res.send(Boom.conflict('A conflict occured' + error));
        }
    }



    //update an user
    async updateAUser(data) {
        try {
            const { id } = data;
            // Check if valid id

            const findUser = await user.findById({ _id: id });
            if (findUser) {
                const updated = await user.findByIdAndUpdate({ _id: id }, data);
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
                message: 'MESSAGES.USER.ERROR' + error.message,
                success: false,
            });
        }
    }


    //    @route   POST /api/v1/user/logout
    //     @desc    Handles user logout
    //     *  @access  Private

    async loggedOutUser() {
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


    //    @route   POST /api/v1/user/reset-password
    //     @desc    Sends reset password link via mail
    //     *  @access  Public

    async sendUserResetPasswordLink(data) {
        try {
            //check if the email exist in the database
            const { email } = data;
            const userEmail = await user.find({ email: email });
            if (!userEmail) {
                return res.status(404).send({
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                });
            }
            //if the email exists send
            const payload = {
                email: userEmail.email,
                id: userEmail.id,
                password: userEmail.password
            };

            const token = jwt.sign(payload, secret, { expiresIn: "30m" });
            const Link = `https://propell-ten.vercel.app/user/reset-password/${encodeURIComponent(
                userEmail.id
            )}/${encodeURIComponent(token)}`;

            //email sending
            const htmlFileDir = path.join(__dirname, "../client/password.html");
            const subject2 = "Reset Password";

            // using nodemailer to send the email
            generate_Template(Link, htmlFileDir)
            mailer({ subject: subject2, template: generate_Template, email: email })

            return res.status(201).send({
                success: true,
                message: 'MESSAGES.USER.EMAIL_SENT',
            });
        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }


    //      @route  GET /api/v1/user/reset-password/:id/:token
    //     @desc  Verifies link sent to the email checking the token and if the user exists using their ID
    //     *  @access  Unique

    async checkUserResetPasswordLink(data) {
        try {
            const { id, token } = data;
            //check if a user with the id exist in db
            const checkUser = await user.findById({ _id: id });
            if (!checkUser) {
                return res.status(401).send({
                    message: 'MESSAGES.USER.ACCOUNT_NOT_REGISTERED',
                    success: false,
                });
            }

            try {
                const secret = process.env.SECRET_KEY;
                jwt.verify(token, secret);
                return res.status(200).send({
                    message: 'MESSAGES.USER.VALID_LINK',
                    success: true,
                });
            } catch (error) {
                return res.status(403).send({
                    message: 'MESSAGES.USER.INVALID_LINK' + error,
                    success: false,
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }


    //      @route  PATCH /api/v1/user/setpassword/:id
    //     @desc    updates the password field
    //     *  @access  Private

    async updateUserPassword(data) {
        try {
            //check if  the email exist
            const { id, password } = data;


            const userfound = await user.findById({ _id: id });
            if (!userfound) {
                return res.status(404).send({
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                });
            }
            //generate new password and update it
            await user.findByIdAndDelete(id, { password: password });
            return res.status(201).send({
                message: 'MESSAGES.USER.PASSWORD_UPDATED',
                success: true,
            });
        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }


    //create a house post

    async postHouseAd(data) {
        try {
            const { id } = data //user id
            let userFound = await user.findById({ _id: id })

            if (!userFound) {
                return res.status(403).send({
                    message: "You are not authorized to perform this action",
                    success: false
                })
            }
            const newHousePost = await House.create({
                user: id,
                ...data
            })
            return res.status(201).send({
                message: "House created successfully",
                success: true,
                newHousePost
            })

        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }

    //delete my post

    async deleteHousePost(data) {
        try {
            //check if the house exist
            const { id } = data //house id
            const findHouse = await House.findById({ _id: id })
            if (!findHouse) {
                return res.status(401).send({
                    message: "No such House post exist",
                    success: false
                })
            }

            await House.findByIdAndDelete({ _id: id })
            return res.status(204).send({
                message: "Post successfully deleted",
                success: true
            })

        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }



    //update my post
    async updateHousePost(data) {
        try {
            const { id } = data
            const findHouse = await House.findById({ _id: id })
            if (!findHouse) {
                return res.status(401).send({
                    message: "No such House post exist",
                    success: false
                })
            }
            const updatedHouse = await House.findOneAndUpdate({ _id: id }, data)
            return res.status(200).send({
                message: "House post updated successfully",
                success: true,
                updatedHouse
            })


        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }

    //get all my House posted
    async getAllMyHouseAd(data) {
        try {
            const { id } = data
            const getUser = await user.find({ _id: id })
            if (!getUser) {
                return res.status(404).send({
                    message: "User does not exist",
                    success: false,
                })
            }

            const houses = await House.find({ user: id })
            if (houses.length == 0) {
                return res.status(403).json({
                    message: "You have to add posted",
                    success: false
                })
            }
            return res.status(200).send({
                message: "Houses has been found",
                success: true,
                houses
            })

        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }



    //add houses to saved for later section
    async savedForLater(data) {
        try {
            const { userId, houseId } = data
            //Check the house exists
            const findHouse = await House.findById({ _id: houseId })
            if (!findHouse) {
                return res.status(401).send({
                    message: "House does not exist",
                    success: false
                })
            }
            //check if the user exist
            const checkUser = await user.findById({ _id: userId })
            if (!checkUser) {
                return res.status(401).send({
                    message: "user doesn't exist",
                    success: false
                })
            }

            //if user exist get the savedItem section
            let savedItems = checkUser.savedItem;
            const saved = savedItems.push(houseId)
            if (!saved) {
                return res.status(403).send({
                    message: "item not saved",
                    success: false
                })
            }
            return res.status(204).send({
                message: 'Item saved for later',
                success: true,
                findHouse
            })
        } catch (error) {
            return res.status(500).send({
                message: 'MESSAGES.USER.SERVER_ERROR' + error,
                success: false,
            });
        }
    }
}

module.exports = new userServices()