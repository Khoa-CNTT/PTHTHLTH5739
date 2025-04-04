// src/pages/Blog.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';
import SearchBar from './blog-components/SearchBar';
import Categories from './blog-components/Categories';
import RecentPosts from './blog-components/RecentPosts';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const blogsPerPage = 4;
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get('http://localhost:4000/api/users/blogs')
			.then((response) => {
				setBlogs(response.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	const filteredBlogs = blogs.filter((blog) => {
		const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			!selectedCategory || blog.category.catName.toLowerCase() === selectedCategory.toLowerCase();
		return matchesSearch && matchesCategory;
	});
	// Pagination logic
	const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
	const startIndex = (currentPage - 1) * blogsPerPage;
	const endIndex = startIndex + blogsPerPage;
	const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	if (loading)
		return (
			<div className="bg-gray-50 min-h-screen">
				<div className="container-cus py-12">
					{/* Hero Section */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Discover the latest news, tips and user guides about our products.
						</p>
					</div>

					<div className="lg:flex lg:gap-12">
						{/* Main Content */}
						<div className="lg:w-2/3">
							<div className="flex justify-center items-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
							</div>
						</div>

						{/* Sidebar */}
						<aside className="lg:w-1/3 mt-12 lg:mt-0">
							<div className="sticky top-24 space-y-8">
								{/* Search */}
								<div className="bg-white p-6 rounded-xl shadow-sm">
									<h3 className="text-xl font-bold text-gray-800 mb-4">Search</h3>
									<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
								</div>

								{/* Categories */}
								<div className="bg-white p-6 rounded-xl shadow-sm">
									<h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
									<Categories onCategorySelect={setSelectedCategory} />
								</div>

								{/* Recent Posts */}
								<div className="bg-white p-6 rounded-xl shadow-sm">
									<h3 className="text-xl font-bold text-gray-800 mb-4">Recent Posts</h3>
									<RecentPosts />
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		);
	if (error) return <p className='error'>Error: {error}</p>;

	console.log("Secat", selectedCategory);

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="container-cus py-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Discover the latest news, tips and user guides about our products.
					</p>
				</div>

				<div className="lg:flex lg:gap-12">
					{/* Main Content */}
					<div className="lg:w-2/3">
						{loading ? (
							<div className="flex justify-center items-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
							</div>
						) : error ? (
							<div className="text-red-500 text-center p-4">{error}</div>
						) : (
							<div className="grid gap-8">
								{currentBlogs.map((blog) => (
									<article
										key={blog._id}
										className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
									>
										<div className="relative">
											<img
												src={blog.image}
												alt={blog.title}
												className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
											/>
											<div className="absolute top-4 right-4">
												<span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
													{blog.category?.catName}
												</span>
											</div>
										</div>

										<div className="p-6">
											<div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
												<div className="flex items-center gap-2">
													<i className="far fa-user"></i>
													{blog.author?.name || 'Unknown'}
												</div>
												<div className="flex items-center gap-2">
													<i className="far fa-calendar"></i>
													{new Date(blog.date).toLocaleDateString()}
												</div>
											</div>

											<h2 className="text-2xl font-bold text-gray-800 mb-4 hover:text-orange-500 transition-colors">
												{blog.title}
											</h2>

											<p className="text-gray-600 mb-6 line-clamp-3">
												{blog.content}
											</p>

											<button
												onClick={() => navigate(`/blog/${blog._id}`)}
												className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
											>
												Read More
												<i className="fas fa-arrow-right"></i>
											</button>
										</div>
									</article>
								))}
							</div>
						)}

						{/* Pagination */}
						<div className="flex justify-center gap-2 mt-12">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`px-4 py-2 rounded-md ${currentPage === 1
									? 'bg-gray-200 text-gray-500 cursor-not-allowed'
									: 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white'
									} transition-colors`}
							>
								Previous
							</button>
							<span className="px-4 py-2 bg-white rounded-md">
								Page {currentPage} of {totalPages}
							</span>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 rounded-md ${currentPage === totalPages
									? 'bg-gray-200 text-gray-500 cursor-not-allowed'
									: 'bg-white text-gray-700 hover:bg-orange-500 hover:text-white'
									} transition-colors`}
							>
								Next
							</button>
						</div>
					</div>

					{/* Sidebar */}
					<aside className="lg:w-1/3 mt-12 lg:mt-0">
						<div className="sticky top-24 space-y-8">
							{/* Search */}
							<div className="bg-white p-6 rounded-xl shadow-sm">
								<h3 className="text-xl font-bold text-gray-800 mb-4">Search</h3>
								<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
							</div>

							{/* Categories */}
							<div className="bg-white p-6 rounded-xl shadow-sm">
								<h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
								<Categories onCategorySelect={setSelectedCategory} />
							</div>

							{/* Recent Posts */}
							<div className="bg-white p-6 rounded-xl shadow-sm">
								<h3 className="text-xl font-bold text-gray-800 mb-4">Recent Posts</h3>
								<RecentPosts />
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default Blog;
