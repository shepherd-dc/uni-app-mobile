const rule = {
	'.read': true,
	'.create': 'auth.uid != null && action == "add-comment"'
}

module.exports = rule
