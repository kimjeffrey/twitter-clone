import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {signIn, useSession} from 'next-auth/client'
import {dev} from '../config'
import LeftSideBar from './LeftSideBar'
import Meta from './Meta'
import styles from '../styles/Layout.module.scss'

export default function Layout({children}) {
  const clientPath = dev ? 'http://localhost:3000' : `https://https://twitter-clone-site.vercel.app`;
  const router = useRouter();
  const [session, loading] = useSession();

  const [title, setTitle] = useState("");

  useEffect(async () => {
    if(router.pathname === "/") {
      setTitle("Home");
    } else if(router.pathname === "/profile/[id]") {
      const res = await fetch(`${clientPath}/api/user/${router.query.id}`);
      const id = await res.json();
      setTitle(id.name);
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
          <h1>{title}</h1>
          {!session && 
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
