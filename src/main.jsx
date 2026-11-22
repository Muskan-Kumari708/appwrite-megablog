import { createElement, lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'


import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthLayout from './components/AuthLayout.jsx'
import Login from './components/Login.jsx'

const homeRoute = lazy(() => import('./pages/Home.jsx'))
const addPostRoute = lazy(() => import('./pages/AddPost.jsx'))
const signupRoute = lazy(() => import('./pages/Signup.jsx'))
const editPostRoute = lazy(() => import('./pages/EditPost.jsx'))
const postRoute = lazy(() => import('./pages/Post.jsx'))
const allPostsRoute = lazy(() => import('./pages/AllPosts.jsx'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: createElement(homeRoute),
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                {createElement(signupRoute)}
                </AuthLayout>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <AuthLayout authentication>
                    {" "}
                    {createElement(allPostsRoute)}
                </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <AuthLayout authentication>
                    {" "}
                    {createElement(addPostRoute)}
                </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <AuthLayout authentication>
                    {" "}
                    {createElement(editPostRoute)}
                </AuthLayout>
            ),
        },
        {
            path: "/post/:slug",
            element: createElement(postRoute),
        },
    ],
},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Suspense fallback={<div className="p-8 text-center text-stone-600">Loading page...</div>}>
      <RouterProvider router={router}/>
    </Suspense>
    </Provider>
  </StrictMode>,
)
