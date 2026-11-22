import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { authUnavailable, login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .catch((error) => {
        if (error.code === 401) {
          dispatch(logout())
        } else {
          dispatch(authUnavailable())
        }
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  return !loading ? (
    <div className='min-h-screen flex flex-col bg-stone-100 text-stone-800'>
      <Header />
      <main className='flex-1 w-full'>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null
}

export default App
