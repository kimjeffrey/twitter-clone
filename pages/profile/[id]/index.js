import {server} from '../../../config'
import {useSession} from 'next-auth/client'
import Meta from '../../../components/Meta'
import Post from '../../../components/Post'
import Tweet from '../../../components/Tweet'

export default function profile({id}) {
  const [session] = useSession();

  function sortByNew(){
    let sortedPosts = [...id.posts];
    sortedPosts.sort((a, b) => {
      return a.date > b.date ? -1 : 1;
    })
    return sortedPosts;
  }

  return (
    <>
      <Meta title="Profile" />
      {session.id === id._id &&
        <Tweet />
      }
      {id.posts && sortByNew().map((post, index) => (
        <Post key={index} id={post._id} postId={post._postId} name={post.name} content={post.content} date={post.date.toString()} />
      ))}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch(`${server}/api/user/${context.params.id}`);
  const id = await res.json();

  return {
    props: {
      id
    }
  }
}