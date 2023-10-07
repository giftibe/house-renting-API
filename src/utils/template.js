const jwt = require("jsonwebtoken");
const generateTemplate = (Link, htmlFileDir) => {
    //email sending
    const htmlFiler = fs.readFileSync(htmlFileDir, "utf8");
    const template = htmlFiler.replace("{{LINK}}", Link);
    return template
}
module.exports = generateTemplate()

