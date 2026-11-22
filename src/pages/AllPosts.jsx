import React, {useState, useEffect} from 'react'
import Container from '../components/container/Container.jsx'
import PostCard from '../components/PostCard.jsx'
import PostsErrorState from '../components/PostsErrorState.jsx'
import PostFilters from '../components/PostFilters.jsx'
import appwriteService from "../appwrite/config";
import { getPostCategory } from '../constants/categories.js'

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const retryPosts = () => {
        setError(null);
        setLoading(true);
        setRetryCount((count) => count + 1);
    };
    const filteredPosts = posts.filter((post) => {
        const contentText = (post.content || '').replace(/<[^>]*>/g, ' ');
        const searchableText = `${post.title || ''} ${contentText} ${getPostCategory(post)}`.toLowerCase();
        return searchableText.includes(search.trim().toLowerCase())
            && (category === 'all' || getPostCategory(post) === category);
    });

    useEffect(() => {
        let isActive = true;

        appwriteService.getPosts().then((posts) => {
            if (isActive && posts?.rows) {
                setPosts(posts.rows);
            }
        }).catch((loadError) => {
            if (isActive) setError(loadError);
        }).finally(() => {
            if (isActive) setLoading(false);
        });

        return () => {
            isActive = false;
        };
    }, [retryCount]);

    return (
        <div className='w-full py-6 sm:py-8'>
            <Container>
                {loading && <p className="py-8 text-center text-stone-600" role="status">Loading stories...</p>}
                {error && <PostsErrorState onRetry={retryPosts} />}
                {!loading && !error && <PostFilters
                    search={search}
                    onSearchChange={setSearch}
                    category={category}
                    onCategoryChange={setCategory}
                />}
                {!loading && !error && (filteredPosts.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">No posts match your search.</p>
                ) : <div className='flex flex-wrap py-8 sm:py-12'>
                    {filteredPosts.map((post) => (
                        <div
                            key={post.$id}
                            className='p-2 w-full sm:w-1/2 lg:w-1/4'
                        >
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>)}
            </Container>
        </div>
    )
}

export default AllPosts
