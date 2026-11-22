import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from '../components/Button.jsx'
import Container from '../components/container/Container.jsx'
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { getPostCategory } from '../constants/categories.js'

export default function Post() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [likesCount, setLikesCount] = useState(0);
    const [userLike, setUserLike] = useState(null);
    const [loadedPostId, setLoadedPostId] = useState(null);
    const [engagementError, setEngagementError] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');
    const [likeError, setLikeError] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isUpdatingLike, setIsUpdatingLike] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [postActionError, setPostActionError] = useState('');
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    useEffect(() => {
        if (!post?.$id) return undefined;

        let isActive = true;
        Promise.allSettled([
            appwriteService.getComments(post.$id),
            appwriteService.getPostLikes(post.$id),
            userData ? appwriteService.getUserLike(post.$id, userData.$id) : Promise.resolve(null),
        ]).then(([commentsResult, likesResult, userLikeResult]) => {
            if (!isActive) return;

            if (commentsResult.status === 'fulfilled') {
                setComments([...commentsResult.value.rows].sort(
                    (first, second) => new Date(second.$createdAt) - new Date(first.$createdAt)
                ));
            }
            if (likesResult.status === 'fulfilled') {
                setLikesCount(likesResult.value.total);
            }
            if (userLikeResult.status === 'fulfilled') {
                setUserLike(userLikeResult.value);
            }
            setEngagementError(
                commentsResult.status === 'rejected' || likesResult.status === 'rejected' || userLikeResult.status === 'rejected'
            );
            setLoadedPostId(post.$id);
        });

        return () => {
            isActive = false;
        };
    }, [post?.$id, userData]);

    const submitComment = async (event) => {
        event.preventDefault();
        if (!userData || !commentText.trim()) return;

        setIsSubmittingComment(true);
        setCommentError('');
        try {
            const createdComment = await appwriteService.createComment({
                postId: post.$id,
                userId: userData.$id,
                userName: userData.name || 'Member',
                content: commentText.trim(),
            });
            setComments((current) => [createdComment, ...current]);
            setCommentText('');
        } catch {
            setCommentError('Your comment could not be posted. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const toggleLike = async () => {
        if (!userData || isUpdatingLike) return;

        setIsUpdatingLike(true);
        setLikeError('');
        try {
            if (userLike) {
                await appwriteService.deleteLike(userLike.$id);
                setUserLike(null);
                setLikesCount((count) => Math.max(0, count - 1));
            } else {
                const like = await appwriteService.createLike({ postId: post.$id, userId: userData.$id });
                setUserLike(like);
                setLikesCount((count) => count + 1);
            }
        } catch {
            setLikeError('Your like could not be updated. Please try again.');
        } finally {
            setIsUpdatingLike(false);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await appwriteService.deleteComment(commentId);
            setComments((current) => current.filter((comment) => comment.$id !== commentId));
        } catch {
            setCommentError('This comment could not be deleted. Please try again.');
        }
    };

    const deletePost = async () => {
        if (!isAuthor || isDeletingPost || !window.confirm('Delete this post? This cannot be undone.')) return;

        setIsDeletingPost(true);
        setPostActionError('');
        try {
            const deleted = await appwriteService.deletePost(post.$id);
            if (!deleted) throw new Error('Delete failed');
            if (post.featuredImage) await appwriteService.deleteFile(post.featuredImage);
            navigate('/');
        } catch {
            setPostActionError('This post could not be deleted. Check your connection and try again.');
        } finally {
            setIsDeletingPost(false);
        }
    };

    return post ? (
        <div className="py-6 sm:py-8">
            <Container>
                {isAuthor && (
                    <div className="mb-4 flex justify-end gap-2">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button bgColor="bg-green-600" className="text-sm sm:text-base">
                                Edit post
                            </Button>
                        </Link>
                        <Button
                            bgColor="bg-red-600"
                            className="text-sm sm:text-base"
                            onClick={deletePost}
                            disabled={isDeletingPost}
                        >
                            {isDeletingPost ? 'Deleting...' : 'Delete post'}
                        </Button>
                    </div>
                )}
                <div className="post-featured-image-wrap w-full flex justify-center mb-4 relative border border-stone-200 bg-white rounded-2xl p-2 shadow-sm">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="post-featured-image rounded-xl"
                    />

                </div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold break-words text-stone-900">
                            {post.title}
                        </h1>
                        <p className="mt-2 text-sm text-amber-700">{getPostCategory(post)}</p>
                    </div>
                </div>
                {postActionError && <p className="mb-4 text-sm text-red-700" role="alert">{postActionError}</p>}
                <div
                    className="post-content browser-css break-words overflow-x-hidden text-stone-700 text-left"
                    onClick={(event) => {
                        if (event.target instanceof Element && event.target.closest("img")) {
                            event.preventDefault();
                        }
                    }}
                >
                    {parse(post.content)}
                </div>

                <section className="mt-10 border-t border-stone-200 pt-6" aria-label="Post reactions and comments">
                    {loadedPostId !== post.$id ? (
                        <p className="text-sm text-stone-600" role="status">Loading comments and likes...</p>
                    ) : (
                        <>
                            {engagementError && (
                                <p className="mb-4 text-sm text-stone-600" role="status">
                                    Comments and likes are temporarily unavailable.
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                                <Button onClick={toggleLike} disabled={!userData || isUpdatingLike}>
                                    {userLike ? '♥ Liked' : '♡ Like'} · {likesCount}
                                </Button>
                                {!userData && <Link className="text-sm text-amber-700 hover:underline" to="/login">Sign in to like</Link>}
                            </div>
                            {likeError && <p className="mt-2 text-sm text-red-700" role="alert">{likeError}</p>}

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-stone-900">Comments ({comments.length})</h2>
                                {userData ? (
                                    <form className="mt-4" onSubmit={submitComment}>
                                        <label className="sr-only" htmlFor="post-comment">Write a comment</label>
                                        <textarea
                                            id="post-comment"
                                            value={commentText}
                                            onChange={(event) => setCommentText(event.target.value)}
                                            maxLength={2000}
                                            rows={3}
                                            placeholder="Share a thoughtful comment..."
                                            className="w-full resize-y rounded-xl border border-stone-300 bg-white p-3 text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        />
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <span className="text-xs text-stone-500">{commentText.length}/2000</span>
                                            <Button type="submit" disabled={isSubmittingComment || !commentText.trim()}>
                                                {isSubmittingComment ? 'Posting...' : 'Post comment'}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="mt-3 text-sm text-stone-600">
                                        <Link className="text-amber-700 hover:underline" to="/login">Sign in</Link> to join the conversation.
                                    </p>
                                )}
                                {commentError && <p className="mt-3 text-sm text-red-700" role="alert">{commentError}</p>}

                                <ul className="mt-5 divide-y divide-stone-200">
                                    {comments.map((comment) => (
                                        <li key={comment.$id} className="py-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-stone-800">{comment.userName}</p>
                                                    <p className="mt-1 whitespace-pre-wrap break-words text-stone-700">{comment.content}</p>
                                                    <time className="mt-2 block text-xs text-stone-500" dateTime={comment.$createdAt}>
                                                        {new Date(comment.$createdAt).toLocaleDateString()}
                                                    </time>
                                                </div>
                                                {userData?.$id === comment.userId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteComment(comment.$id)}
                                                        className="shrink-0 text-sm text-stone-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </section>
            </Container>
        </div>
    ) : null;
}
