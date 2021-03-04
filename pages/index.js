import {useEffect, useState} from 'react'
import {useSession} from 'next-auth/client'
import {server} from '../config'
import Post from '../components/Post'
import Tweet from '../components/Tweet'
import styles from '../styles/Home.module.scss'

export default function Home({users}) {
  const [session] = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    users.forEach(user => {
      setPosts(prevPosts => {
        return [...prevPosts, ...user.posts];
      })
    })
  }, [])

  function sortByNew(){
    let sortedPosts = [...posts];
    sortedPosts.sort((a, b) => {
      return a.date > b.date ? -1 : 1;
    })
    return sortedPosts;
  }

  return (
    <div>
      {session &&
        <Tweet />
      }
      {sortByNew().map((post, index) => (
        <Post key={index} id={post.id} content={post.content} date={post.date.toString()} />
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`${server}/api/users`);
  const users = await res.json();

  return {
    props: {
      users
    }
  }
}