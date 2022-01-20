import { useState, useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';
import SearchDropdown from './components/SearchDropdown';

const COUNTRY_API_URL = 'https://restcountries.com/v3.1/all';

function App() {
	const [loading, setLoading] = useState(false);

	const { setCountries } = useStoreActions((actions) => actions.countries);

	useEffect(() => {
		async function initialization() {
			setLoading(true);

			try {
				const response = await fetch(COUNTRY_API_URL);
				const countries = await response.json();
				setCountries(countries);
				setLoading(false);
			} catch (e) {
				console.log(e);
				setLoading(false);
			}
		}

		initialization();
	}, []);

	if (loading) {
		return <div>Loading......</div>;
	}

	return (
		<div className='flex justify-center items-center h-screen'>
			<SearchDropdown />
		</div>
	);
}

export default App;
