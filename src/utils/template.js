const jwt = require("jsonwebtoken");
const generateTemplate = (email, secret) => {
    const verification_Token = jwt.sign({ email }, secret, {
        expiresIn: "30m",
    });
    const verificationLink = `https://propell-ten.vercel.app/verifyMail/${encodeURIComponent(
        verification_Token
    )}`;

    //email sending
    const htmlFileDir = path.join(__dirname, "../client/verify-1.html");
    const htmlFiler = fs.readFileSync(htmlFileDir, "utf8");
    const template = htmlFiler.replace("{{VERIFICATIONLINK}}", verificationLink);
    return template
}
module.exports = generateTemplate()

