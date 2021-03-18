import {server} from '../../../config'
import {useEffect, useState} from 'react'
import {useSession} from 'next-auth/client'
import Meta from '../../../components/Meta'
import Post from '../../../components/Post'
import Tweet from '../../../components/Tweet'
import styles from '../../../styles/ProfilePage.module.scss'

export default function profile({user}) {
  const [session] = useSession();

  const [navSelection, setNavSelection] = useState("Tweets");

  function handleClick(event) {
    switch(event.target.innerText) {
      case "Replies":
        setNavSelection("Replies");
        break;
      case "Likes":
        setNavSelection("Likes");
        break;
      default:
        setNavSelection("Tweets");
    }
  }
  
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
      <nav className={styles.navbar}>
        <div onClick={handleClick} className={navSelection === "Tweets" ? `${styles.navItem} ${styles.selected}` : styles.navItem}>Tweets</div>
        <div onClick={handleClick} className={navSelection === "Replies" ? `${styles.navItem} ${styles.selected}` : styles.navItem}vvvv>Replies</div>
        <div onClick={handleClick} className={navSelection === "Likes" ? `${styles.navItem} ${styles.selected}` : styles.navItem}>Likes</div>
      </nav>
      {navSelection === "Tweets" && user.posts && sortByNew().map((post, index) => (
        <Post key={index} id={post._id} user={user._id} name={user.name} content={post.content} date={post.date.toString()} likes={post.likes} replies={post.replies.length} />
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