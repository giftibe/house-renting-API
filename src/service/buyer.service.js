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
            const existingUser = await Buyer.find({ email: email })
            if (existingUser) {
                return res.send(Boom.conflict('Email already exists'))
            }

            //save to data
            await Buyer.create({
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
            const findUser = await Buyer.find({ email: email })


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




}















module.exports = BuyerServices()

















//login
//logout
//verify email
//forgot password
//reset password
//update account
