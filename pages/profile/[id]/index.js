import {server} from '../../../config'
import {useSession} from 'next-auth/client'
import Meta from '../../../components/Meta'
import Post from '../../../components/Post'
import Tweet from '../../../components/Tweet'

export default function profile({id}) {
  const [session] = useSession();

  return (
    <>
      <Meta title="Profile" />
      <div>
        {id.id}'s Profile Page
      </div>
      {session.id === id.id &&
        <Tweet />
      }
      {id.posts.map((post, index) => (
        <Post key={index} id={post.id} content={post.content} date={post.date.toString()} />
      ))}
    </>
  )
}

export const getStaticProps = async (context) => {
  const res = await fetch(`${server}/api/user/${context.params.id}`);
  const id = await res.json();

  return {
    props: {
      id
    }
  }
}

export const getStaticPaths = async () => {
  const res = await fetch(`${server}/api/users`);
  const users = await res.json();
  const ids = users.map(user => user.id);
  const paths = ids.map(id => ({params: {id}}));

  return {
    paths,
    fallback: false
  }
}