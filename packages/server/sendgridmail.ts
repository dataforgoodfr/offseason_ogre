require("dotenv").config();
const jwt = require("jsonwebtoken");
const sendGridMail = require("@sendgrid/mail");
const url = "https://atelierogre-staging.herokuapp.com/";

/**** Email validation ****/

const email = "felix.barriere@gmail.com";

/**** Setting up JWT and create token *****/

const generate = (email) => {
	return jwt.sign({ email }, "secret_key", { expiresIn: "60" });
};

const token = generate(email);

/**** Sending mail via Sendgrid ****/

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (msg) => {
	await sendGridMail.send(msg);
};

sendMail({
	to: "felix.barriere@gmail.com",
	from: "felix.barriere@gmail.com",
	subject: "Votre lien de connexion OGRE",
	text: "Votre lien: ",
	html: `<p><a href="${url}"> account?token=${token} </a></p>`,
});
