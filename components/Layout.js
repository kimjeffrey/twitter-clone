import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {signIn, useSession} from 'next-auth/client'
import {dev} from '../config'
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import LeftSideBar from './LeftSideBar'
import Meta from './Meta'
import styles from '../styles/Layout.module.scss'

export default function Layout({children}) {
  const clientPath = dev ? 'http://localhost:3000' : `https://twitter-clone-site.vercel.app`;
  const router = useRouter();
  const [session, loading] = useSession();

  const [title, setTitle] = useState("");
  const [tweetCount, setTweetCount] = useState(0);
  const [createdDate, setCreatedDate] = useState("");

  useEffect(async () => {
    if(router.pathname === "/") {
      setTitle("Home");
    } else if(router.pathname === "/profile/[id]") {
      const res = await fetch(`${clientPath}/api/user/${router.query.id}`);
      const id = await res.json();
      setTitle(id.name);
      let date = new Date(id.createdAt);
      setTweetCount(id.posts.length);
      setCreatedDate((prev) => {
        let newDate = "Joined " + date.toLocaleString('default', { month: 'long' });
        newDate += " " + date.getFullYear();
        return newDate;
      })
    } else if(router.pathname === "/post/[id]") {
      setTitle("Tweet");
    }
  }, [children])

  function handleSignIn(event) {
    event.preventDefault();
    signIn();
  }

  return (
    <>
      <Meta />
      <div className={styles.container}>
        <LeftSideBar />
        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <h1>{title}</h1>
            {router.pathname === "/profile/[id]" && <>
              <div className={styles.profileInfo}>
                {tweetCount} {tweetCount === 1 ? "Tweet" : "Tweets" } ·
                <FontAwesomeIcon className={styles.icon} icon={faCalendarAlt} />{createdDate}
              </div>
            </>}
          </div>
          {!loading && !session && 
          <div className={styles.message}>
            Sign in to view posts.
            <button onClick={handleSignIn}>Sign in</button>
          </div>
          }
          {session &&
            <>{children}</>
          }
        </div>
      </div>
    </>
  )
}
