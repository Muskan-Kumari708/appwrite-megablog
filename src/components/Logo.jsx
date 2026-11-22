import React from 'react'

function Logo({ width = '100px', className = 'text-white' }) {
  return (
    <div
      style={{ width }}
      className={`font-bold text-lg sm:text-xl tracking-wide truncate ${className}`}
    >
      Mega<span className='text-amber-500'>Blog</span>
    </div>
  )
}

export default Logo