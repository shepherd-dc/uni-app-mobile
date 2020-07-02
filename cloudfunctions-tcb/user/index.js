'use strict'; 
const { register } = require('./register/index.js') 
const { login } = require('./login/index.js')
 
exports.main = async (event, context) => { 
	switch (event.type) { 
		case 'register':
			return register(event) 
		case 'login':
			return login(event) 
	}
};
