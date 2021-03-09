import {server} from '../../../config'
import Post from '../../../components/Post'

export default function index({post}) {
  return (
    <div>
      <Post id={post.user._id} postId={post._id} name={post.user.name} content={post.content} date={post.date} />
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch(`${server}/api/post/${context.params.id}`);
  const post = await res.json();

  return {
    props: {
      post
    }
  }
}