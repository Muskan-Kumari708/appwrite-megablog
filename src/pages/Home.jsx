import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import appwriteService from "../appwrite/config"
import Container from '../components/container/Container.jsx'
import PostCard from '../components/PostCard.jsx'
import Button from '../components/Button.jsx'
import PostsErrorState from '../components/PostsErrorState.jsx'
import { useSelector } from 'react-redux'

function Hero({ authStatus }) {
    return (
        <section className="w-full bg-stone-100 border-b border-stone-200">
            <Container>
                <div className="py-10 sm:py-16 text-center">
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-600 mb-3">
                        Welcome to MegaBlog
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900">
                        Stories, ideas &amp; <span className="text-amber-600">everything in between</span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-lg text-stone-600 max-w-2xl mx-auto">
                        {authStatus
                            ? 'Read what others are writing, or share your own thoughts with the world.'
                            : 'Discover fresh perspectives and ideas from the MegaBlog community.'}
                    </p>
                    {authStatus && (
                        <Link to="/add-post">
                            <Button className="mt-6">Start Writing</Button>
                        </Link>
                    )}
                </div>
            </Container>
        </section>
    )
}

function Home() {
    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [postsError, setPostsError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const authStatus = useSelector((state) => state.auth.status)
    const retryPosts = () => {
        setPostsError(null)
        setLoadingPosts(true)
        setRetryCount((count) => count + 1)
    }

    useEffect(() => {
        if (authStatus !== true) return undefined

        let isActive = true

        appwriteService.getPosts().then((posts) => {
            if (isActive && posts?.rows) {
                setPosts(posts.rows)
                setPostsError(null)
            }
        }).catch((error) => {
            if (isActive) setPostsError(error)
        }).finally(() => {
            if (isActive) setLoadingPosts(false)
        })

        return () => {
            isActive = false
        }
    }, [authStatus, retryCount])

    if (authStatus !== true) {
        return (
            <div className="w-full">
                <Hero authStatus={false} />
                <div className="py-8 text-center sm:py-12">
                    <Container>
                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                            Community
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-stone-800 sm:text-2xl">
                            Stories from our readers and writers
                        </h2>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                            Sign in from the navigation to read published posts and share your own.
                        </p>
                    </Container>
                </div>
            </div>
        )
    }

    if (loadingPosts) {
        return (
            <div className="w-full">
                <Hero authStatus={authStatus} />
                <Container>
                    <p className="py-12 text-center text-stone-600" role="status">
                        Loading stories...
                    </p>
                </Container>
            </div>
        )
    }

    if (postsError) {
        return (
            <div className="w-full">
                <Hero authStatus={authStatus} />
                <Container>
                    <PostsErrorState onRetry={retryPosts} />
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full">
                <Hero authStatus={authStatus} />
                <div className="py-8 sm:py-12 text-center">
                    <Container>
                        <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
                            No published stories yet
                        </h2>
                        <p className="mt-2 text-stone-600">
                            New stories will show up here. Check back soon.
                        </p>
                        {authStatus && (
                            <Link to="/add-post">
                                <Button className="mt-5">Write the first post</Button>
                            </Link>
                        )}
                    </Container>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Hero authStatus={authStatus} />
            <div className="py-8 sm:py-12">
                <Container>

                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post.$id} className="p-2 w-full sm:w-1/2 lg:w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Home
