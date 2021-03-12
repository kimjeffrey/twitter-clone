import {server} from '../../../config'
import Meta from '../../../components/Meta'
import Post from '../../../components/Post'
import Reply from '../../../components/Reply'
import styles from '../../../styles/PostPage.module.scss'

export default function index({post}) {
  return (
    <>
    <Meta title="Post" />
    <div>
      <Post id={post._id} user={post.user._id} name={post.user.name} content={post.content} date={post.date} likes={post.likes} replies={post.replies.length} />
    </div>
    {post.replies > 0 && 
      <h4 className={styles.title}>Replies</h4>
    }
    {post.replies.map(reply => (
      <Reply id={reply._id} user={reply.user._id} name={reply.user.name} content={reply.content} date={reply.date} likes={reply.likes} />
    ))}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch(`${server}/api/post/${context.params.id}`);
  const post = await res.json();
  console.log(post);

  return {
    props: {
      post
    }
  }
}