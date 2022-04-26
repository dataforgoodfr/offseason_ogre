import { prisma } from "../../../database";
import { User } from "../types/entity";
// const jwt = require("jsonwebtoken");
// const sendGridMail = require("@sendgrid/mail");  utiliser import

const model = prisma.user;
type Model = User;

const crudServices = { getDocument, create, isMailAlreadyUsed };
const services = { ...crudServices };

export { services };

async function getDocument(id: number): Promise<Model | null> {
	return model.findUnique({ where: { id } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
	return model.create({ data: document });
}

async function isMailAlreadyUsed(email: string): Promise<number | null> {
	const mail = await model.findUnique({ where: { email } });
	if (mail) {
		return 1;
	} else {
		return 0;
	}
}

const generate = (email) => {
	return jwt.sign({ email }, "secret_key", { expiresIn: "60" });
};

async function sendWithSendgrid(email: String) {
	const url = "https://atelierogre-staging.herokuapp.com/";
	const token = generate(email);

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
}