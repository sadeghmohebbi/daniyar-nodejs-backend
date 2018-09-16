module.exports = (req, res, next) => {
    var errors = req.validationErrors();
	if (errors) {
        return res.status(422).send({errors});
	} else {
		return next();
	}
}