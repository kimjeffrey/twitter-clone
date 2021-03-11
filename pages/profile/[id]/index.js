import {server} from '../../../config'
import {useSession} from 'next-auth/client'
import Meta from '../../../components/Meta'
import Post from '../../../components/Post'
import Tweet from '../../../components/Tweet'

export default function profile({user}) {
  const [session] = useSession();

  function sortByNew(){
    let sortedPosts = [...user.posts];
    sortedPosts.sort((a, b) => {
      return a.date > b.date ? -1 : 1;
    })
    return sortedPosts;
  }

  return (
    <>
      <Meta title="Profile" />
      {session.id === user._id &&
        <Tweet />
      }
      {user.posts && sortByNew().map((post, index) => (
        <Post key={index} id={post._id} user={user._id} name={user.name} content={post.content} date={post.date.toString()} likes={post.likes} />
      ))}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch(`${server}/api/user/${context.params.id}`);
  const user = await res.json();

  return {
    props: {
      user
    }
  }
}