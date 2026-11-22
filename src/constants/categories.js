export const POST_CATEGORIES = [
  'Technology',
  'Lifestyle',
  'Education',
  'News',
  'General',
]

export function getPostCategory(post) {
  return post.category || 'General'
}
