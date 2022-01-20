import { action } from 'easy-peasy';

const countries = {
    items: {},
    setCountries: action((state, payload) => {
        state.items = payload.reduce((acc, country, index) => {
            const id = index
            // should have unique country id from endpoint
            acc[id] = {
                id,
                ...country
            };

            return acc;
        }, {});
    }),
}

export default countries;