const path = require('path');
const fs = require('fs');

const generateTemplate = (Link, htmlFileDir) => {
    // Email sending
    const htmlFiler = fs.readFileSync(htmlFileDir, "utf8"); // Pass 'htmlFileDir' as a string
    const template = htmlFiler.replace("{{LINK}}", Link);
    return template;
};

module.exports = generateTemplate;
