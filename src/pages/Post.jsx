import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from '../components/Button.jsx'
import Container from '../components/container/Container.jsx'
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
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

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-6 sm:py-8">
            <Container>
                <div className="post-featured-image-wrap w-full flex justify-center mb-4 relative border border-stone-200 bg-white rounded-2xl p-2 shadow-sm">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="post-featured-image rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 flex gap-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="text-sm sm:text-base">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                bgColor="bg-red-500"
                                className="text-sm sm:text-base"
                                onClick={deletePost}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold break-words text-stone-900">
                        {post.title}
                    </h1>
                </div>
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
            </Container>
        </div>
    ) : null;
}
