/**** user auth using token ****/
/**** à implémenter sur la page d'acceuil ****/
const isAuthorized = (req, res) => {
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Bearer ')) {
		res.status(401).send({ error: 'Mauvaise identification. Votre lien n\'est peut etre plus valide' });
		return;
	}
};