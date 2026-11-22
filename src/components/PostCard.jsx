import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import { getPostCategory } from '../constants/categories.js'

function PostCard({ $id, title, featuredImage, category }) {
  return (
    <Link to={`/post/${$id}`} className='block h-full'>
      <div className='w-full h-full bg-white border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-sm duration-200 hover:shadow-md hover:-translate-y-0.5'>
        <div className='w-full mb-3 sm:mb-4 aspect-video overflow-hidden rounded-xl bg-stone-200'>
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className='w-full h-full object-cover'
          />
        </div>
        <h2 className='text-lg sm:text-xl font-semibold text-lg text-stone-900 break-words line-clamp-2'>
          {title}
        </h2>
        <span className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          {getPostCategory({ category })}
        </span>
      </div>
    </Link>
  )
}

export default PostCard
