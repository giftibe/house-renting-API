const express = require('express');
const app = express();
function isValidUUID(req, res, next) {
    const uuid = req.params.customAdminId;
    const uuid2 = req.params.customUserId
    const uuid3 = req.params.customHouseId


    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (uuidPattern.test(uuid) || uuidPattern.test(uuid2) || uuidPattern.test(uuid3)) {
        next();
    } else {
        res.status(400).json({ error: 'Invalid UUID' });
    }
}

module.exports = isValidUUID;