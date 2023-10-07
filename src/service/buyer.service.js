const Buyer = require('../model/buyer.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const generate_Template = require('../utils/template')
const { subject1, secret } = process.env


class BuyerServices {
    async createBuyer(data) {
        try {
            const { email, password } = data;
            //check if email exist
            const existingUser = await Buyer.find({ email: email }, { _id: 1, password: 0 })
            if (existingUser) {
                return res.send(Boom.conflict('Email already exists'))
            }

            //save to data
            await Buyer.create({
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


    async loginBuyer(data) {
        try {
            const { email, password } = data
            //check if the user email exists in db
            const findUser = await Buyer.find({ email: email })


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






    //update an Seller
    async updateABuyer(data) {
        try {
            const { id } = data;
            // Check if valid id

            const findUser = await Buyer.findById({ _id: id });
            if (findUser) {
                const updated = await Buyer.findByIdAndUpdate({ _id: id }, data);
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

    async loggedOutBuyer() {
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


    // ==




    //    @route   POST /api/v1/user/reset-password
    //     @desc    Sends reset password link via mail
    //     *  @access  Public

    async sendBuyerResetPasswordLink(data) {
        try {
            //check if the email exist in the database
            const { email } = data;
            const userEmail = await Buyer.find({ email: email });
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

    async checkBuyerResetPasswordLink(data) {
        try {
            const { id, token } = data;
            //check if a user with the id exist in db
            const checkUser = await Buyer.findById({ _id: id });
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

    async updateBuyerPassword(data) {
        try {
            //check if  the email exist
            const { id, password } = data;


            const userfound = await Buyer.findById({ _id: id });
            if (!userfound) {
                return res.status(404).send({
                    message: 'MESSAGES.USER.EMAIL_NOTFOUND',
                    success: false,
                });
            }
            //generate new password and update it
            await Buyer.findByIdAndDelete(id, { password: password });
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

}



module.exports = new BuyerServices()

//login
//logout
//verify email
//forgot password
//reset password
//update account
