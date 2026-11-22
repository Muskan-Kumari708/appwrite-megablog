import React from 'react'
import { POST_CATEGORIES } from '../constants/categories.js'

export default function PostFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row">
      <label className="sr-only" htmlFor="post-search">Search posts</label>
      <input
        id="post-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search posts..."
        className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
      />
      <label className="sr-only" htmlFor="post-category">Filter by category</label>
      <select
        id="post-category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 sm:w-56"
      >
        <option value="all">All categories</option>
        {POST_CATEGORIES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  )
}
