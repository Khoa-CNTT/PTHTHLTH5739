import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
	return (
		<div className='flex'>
			<input
				type='text'
				placeholder='Search here...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className='w-full px-4 border focus rounded-l-md !border-gray-250'
			/>
			<button className='focus ml-[-1px] rounded-r-md bg-red p-3 text-white'>
				<FaSearch />
			</button>
		</div>
	);
};

export default SearchBar;
