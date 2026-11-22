import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import Select from '../Select.jsx'
import RTE from '../RTE.jsx'
import appwriteService from '../../appwrite/config'
import { POST_CATEGORIES } from '../../constants/categories.js'


function PostForm({post}) {
  const [submitError, setSubmitError] = useState('')
  const {register, handleSubmit, setValue, control, getValues, formState: { isSubmitting }} = useForm({
    defaultValues: {
      title: post?.title || '',
      slug:post?.slug || '',
      content:post?.content || '',
      category: post?.category || 'General',
      status: post?.status || 'active',
    }
  })

  const navigate = useNavigate()
  const userData = useSelector(state => state.auth.userData)
  const title = useWatch({ control, name: 'title' })
  const previousTitle = useRef(title)

  const submit = async (data) => {
    setSubmitError('')
    let uploadedFileId = null

    try {
      const imageFile = data.image?.[0]
      if (imageFile) {
        const uploadedFile = await appwriteService.uploadFile(imageFile)
        if (!uploadedFile) throw new Error('Image upload failed')
        uploadedFileId = uploadedFile.$id
      }

      if (post) {
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: uploadedFileId || post.featuredImage,
        })

        if (!dbPost) throw new Error('Post update failed')
        if (uploadedFileId && post.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage)
        }
        navigate(`/post/${dbPost.$id}`)
      } else {
        if (!uploadedFileId) throw new Error('Featured image is required')
        const dbPost = await appwriteService.createPost({
          ...data,
          featuredImage: uploadedFileId,
          userId: userData.$id,
        })

        if (!dbPost) throw new Error('Post creation failed')
        navigate(`/post/${dbPost.$id}`)
      }
    } catch {
      if (uploadedFileId) await appwriteService.deleteFile(uploadedFileId)
      setSubmitError('Post could not be saved. Check your Appwrite permissions and try again.')
    }
  }

  const slugTransform = useCallback((value)=>{
    if(value && typeof value === 'string'){
      return value
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, '-')  
      .replace(/\s/g, '-')
    }
    return''
  },[])

  useEffect(() => {
    if (previousTitle.current !== title) {
      setValue('slug', slugTransform(title), { shouldValidate: true })
      previousTitle.current = title
    }
  }, [title, slugTransform, setValue])


  return (
     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full md:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full md:w-1/3 px-2 mt-4 md:mt-0">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={POST_CATEGORIES}
                    label="Category"
                    className="mb-4"
                    {...register("category", { required: true })}
                />
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                {submitError && <p className="mb-3 text-sm text-red-700" role="alert">{submitError}</p>}
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}

export default PostForm
