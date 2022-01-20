import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useStoreState } from 'easy-peasy';
import { FixedSizeList as List } from 'react-window';
import Fuse from 'fuse.js';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { cls, truncateString } from '../utils/helpers';

/*
    https://github.com/bvaughn/react-window
*/
const ITEM_SIZE = 40;
const WINDOW_WIDTH = 280;
const WINDOW_HEIGHT = 220;
const PADDING_SIZE = 15;
const innerElementType = forwardRef(({ style, ...rest }, ref) => (
	<ul
		ref={ref}
		style={{
			...style,
			height: `${parseFloat(style.height) + PADDING_SIZE * 2}px`,
		}}
		{...rest}
	/>
));

const SearchDropdown = () => {
	const elementRef = useRef();

	const [searchText, setSearchText] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [dontBlur, setDontBlur] = useState(false);
	const [selectedCountryID, setSelectedCountryID] = useState(-1);

	const { items } = useStoreState((state) => state.countries);
	const countryList = Object.values(items);

	const fuse = new Fuse(countryList, {
		keys: ['name.common'],
		includeScore: true,
	});

	const handleTextSearch = (e) => {
		const search = e.target.value;
		setSearchText(search);
		setSelectedCountryID(-1);

		// user may select all and clear the search text
		if (!search) {
			parseSearchResult(search);
		}
	};

	const handleFocusSearch = () => {
		if (selectedCountryID !== -1) {
			const wholeList = fuse._docs.map((item) => ({
				item,
				matches: [],
				score: 1,
			}));
			setSearchResult(wholeList);
		} else {
			parseSearchResult(searchText);
		}
	};

	const handleBlurSearch = () => {
		if (!dontBlur) {
			setSearchResult([]);
		}
	};

	const handleClickOption = (itemID) => {
		const selectedCountry = items[itemID];
		const commonName = selectedCountry?.name?.common;
		setSelectedCountryID(itemID);
		setSearchText(commonName);
		setDontBlur(false);
		setSearchResult([]);
	};

	const onMouseEnter = () => {
		setDontBlur(true);
	};

	const onMouseLeave = () => {
		setDontBlur(false);
	};

	const parseSearchResult = (searchText) => {
		if (searchText) {
			const result = fuse.search(searchText);
			setSearchResult(result);
		} else {
			const wholeList = fuse._docs.map((item) => ({
				item,
				matches: [],
				score: 1,
			}));
			setSearchResult(wholeList);
		}
	};

	useEffect(() => {
		// User can clear search text manually
		if (!searchText) {
			return;
		}

		// Do not search again if user has already select a country
		if (selectedCountryID === -1) {
			parseSearchResult(searchText);
		}
	}, [searchText]);

	useEffect(() => {
		if (selectedCountryID > -1) {
			elementRef.current.scrollToItem(selectedCountryID, 'center');
		}
	}, [selectedCountryID, searchResult]);

	const selectedItem = items[selectedCountryID];

	return (
		<div className='w-[280px] m-auto flex flex-col'>
			<div className='relative rounded-md shadow-sm'>
				{selectedItem && (
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<span className='text-gray-500 sm:text-sm'>{selectedItem?.flag}</span>
					</div>
				)}
				<input
					type='text'
					id='search-select'
					className={cls(
						'focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-5 pr-12 py-2 sm:text-sm border-2 border-gray-300 rounded-md',
						selectedItem && 'pl-9'
					)}
					autoComplete='off'
					placeholder={searchResult.length > 0 ? 'Search' : 'Select'}
					value={searchText}
					onChange={handleTextSearch}
					onFocus={handleFocusSearch}
					onBlur={handleBlurSearch}
				/>
				<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
					<ChevronDownIcon className='h-5 w-5 text-gray-500' />
				</div>
			</div>

			<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={cls(searchResult.length > 0 && 'shadow-xl rounded-md')}>
				<List
					itemData={searchResult}
					itemCount={searchResult.length}
					innerElementType={innerElementType}
					itemSize={ITEM_SIZE}
					width={WINDOW_WIDTH}
					height={WINDOW_HEIGHT}
					ref={elementRef}
				>
					{({ data, index, style }) => {
						const item = data[index].item;
						const currentID = item.id;
						const flag = item?.flag;
						const commonName = item?.name?.common;

						return (
							<li
								className={cls(
									'flex items-center cursor-pointer hover:bg-gray-100 hover:text-indigo-500 px-6',
									selectedCountryID === currentID && 'bg-indigo-200 text-indigo-500'
								)}
								style={{
									...style,
									top: `${parseFloat(style.top) + PADDING_SIZE}px`,
								}}
								onClick={() => handleClickOption(item.id)}
							>
								<div className='mr-4'>{flag}</div>
								<div>{truncateString(commonName, 20)}</div>
							</li>
						);
					}}
				</List>
			</div>
		</div>
	);
};

export default SearchDropdown;
