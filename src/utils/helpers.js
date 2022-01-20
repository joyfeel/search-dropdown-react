import { twMerge } from 'tailwind-merge';

export const cls = (...classes) => {
	return twMerge(...classes);
};

export const truncateString = (str, num) => {
	if (str.length <= num) {
		return str;
	}

	return str.slice(0, num) + '...';
};
