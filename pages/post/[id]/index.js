import {server} from '../../../config'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Post from '../../../components/Post'

export default function index({user}) {
  const router = useRouter();

  const {id} = router.query;
  const [post, setPost] = useState({});

  useEffect(() => {
    const findPost = user.posts.filter(post => post._postId.toString() === id.toString());
    const post = findPost[0]
    setPost(post);
  }, [])

  return (
    <div>
      <Post id={post._id} postId={post._postId} name={post.name} content={post.content} date={post.date} />
    </div>
  )
}

export const getServerSideProps = async ({params, query}) => {
  const res = await fetch(`${server}/api/user/${query.user}`);
  const user = await res.json();

  return {
    props: {
      user
    }
  }
}