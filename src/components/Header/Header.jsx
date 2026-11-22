import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Container from '../container/Container.jsx'
import Logo from '../Logo.jsx'
import LogOutBtn from './LogoutBtn.jsx'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: authStatus !== true },
    { name: 'Signup', slug: '/signup', active: authStatus !== true },
    { name: 'All Posts', slug: '/all-posts', active: authStatus === true },
    { name: 'Add Post', slug: '/add-post', active: authStatus === true },
  ]

  const handleNav = (slug) => {
    navigate(slug)
    setMenuOpen(false)
  }

  return (
    <header className='sticky top-0 z-50 py-3 shadow-md bg-stone-800 text-stone-100'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='auto' />
            </Link>
          </div>

          <button
            className='ml-auto md:hidden p-2 rounded hover:bg-stone-700'
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label='Toggle menu'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              {menuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>

          <ul className='hidden md:flex ml-auto items-center'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => handleNav(item.slug)}
                    className='inline-block px-4 lg:px-6 py-2 duration-200 hover:bg-stone-700 hover:text-amber-400 rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus === true && (
              <li>
                <LogOutBtn />
              </li>
            )}
          </ul>
        </nav>

        {menuOpen && (
          <ul className='md:hidden mt-3 flex flex-col gap-1'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => handleNav(item.slug)}
                    className='w-full text-left px-4 py-2 duration-200 hover:bg-stone-700 hover:text-amber-400 rounded-lg'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus === true && (
              <li>
                <LogOutBtn className='w-full text-left rounded-lg px-4' />
              </li>
            )}
          </ul>
        )}
      </Container>
    </header>
  )
}

export default Header
