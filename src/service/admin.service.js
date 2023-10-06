const Admin = require('../model/admin.model')
const Boom = require('@hapi/boom');
const mailer = require('../utils/emailer')
const generate_Template = require('../utils/template')
const { subject1, secret } = process.env


class AdminServices {
    async createAdmin(data) {
        try {
            const { email, password } = data;
            //check if email exist
            const existingUser = await Admin.find({ email: email })
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




    //verify account
    //login
    //logout
    //get user info (name, email)
    //update profile picture/bio
    // delete a post
    //block an account
    //unblock an account
    //get all posts of the user
    //get a single post 

}

module.exports = AdminServices()