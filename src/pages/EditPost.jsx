import React, {useEffect, useState} from 'react'
import Container from '../components/container/Container.jsx'
import PostForm from '../components/post-form/PostForm.jsx'
import appwriteService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post && post.userId === userData?.$id) {
                    setPosts(post)
                } else if (post) {
                    navigate(`/post/${post.$id}`)
                } else {
                    navigate('/')
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate, userData?.$id])
  return post ? (
    <div className='py-8 sm:py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost
