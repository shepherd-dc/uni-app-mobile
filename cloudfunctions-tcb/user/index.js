'use strict'; 
const { add } = require('./add/index.js') 
const { get } = require('./get/index.js')
 
exports.main = async (event, context) => { 
	switch (event.type) { 
		case 'add':
			return add(event) 
		case 'get':
			return get(event) 
	}
};
