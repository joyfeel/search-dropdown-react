import { createStore } from 'easy-peasy';
import { createLogger } from 'redux-logger';
import countries from './countries';

const modal = {
	countries,
};

const middleware = [];
if (process.env.NODE_NEV !== 'production') {
	const logger = createLogger();
	middleware.push(logger);
}

const config = {
	middleware,
};

const store = createStore(modal, config);

export default store;
