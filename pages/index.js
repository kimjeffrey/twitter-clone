import {useEffect, useState} from 'react'
import {useSession} from 'next-auth/client'
import {server} from '../config'
import Post from '../components/Post'
import Tweet from '../components/Tweet'
import styles from '../styles/Home.module.scss'

export default function Home({posts}) {
  const [session] = useSession();

  function sortByNew(){
    let sortedPosts = [...posts];
    sortedPosts.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    })
    return sortedPosts;
  }

  return (
    <div>
      {session &&
        <Tweet />
      }
      {sortByNew().map((post) => (
        <Post key={post._id} id={post._id} user={post.user._id} name={post.user.name} content={post.content} date={post.date.toString()} likes={post.likes} replies={post.replies.length} />
      ))}
    </div>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch(`${server}/api/posts`);
  const posts = await res.json();

  return {
    props: {
      posts
    }
  }
}