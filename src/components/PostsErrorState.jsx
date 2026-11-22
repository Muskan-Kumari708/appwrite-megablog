import React from 'react'
import Button from './Button.jsx'

export default function PostsErrorState({ onRetry }) {
  return (
    <div
      className="mx-auto my-8 max-w-xl rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center shadow-sm sm:my-12"
      role="alert"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.9 2.7 17.1A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
        Stories are taking a little longer to load
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
        Something went wrong while fetching the posts. Please try again.
      </p>
      <Button className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
