function Pagination({ curPage, numPages, setCurPage }) {
	return (
		<div className='flex justify-center gap-4'>
			{Array.from({ length: numPages }).map((_, i) => (
				<button
					className={`focus flex h-12 w-12 items-center justify-center hover:bg-red-500 hover:text-white rounded-md border px-4 py-2 font-semibold ${
						curPage === i ? 'border-red-500 bg-red-500 text-white' : 'border'
					}`}
					key={i}
					onClick={() => setCurPage(i)}
				>
					{i + 1}
				</button>
			))}
		</div>
	);
}

export default Pagination;
