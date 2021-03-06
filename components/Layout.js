import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {signIn, useSession} from 'next-auth/client'
import {server} from '../config'
import LeftSideBar from './LeftSideBar'
import Meta from './Meta'
import styles from '../styles/Layout.module.scss'

export default function Layout({children}) {
  const router = useRouter();
  const [session, loading] = useSession();

  const [title, setTitle] = useState("");

  useEffect(async () => {
    console.log(router.pathname);
    if(router.pathname === "/") {
      setTitle("Home");
    } else if(router.pathname === "/profile/[id]") {
      const res = await fetch(`${server}/api/user/${router.query.id}`);
      const id = await res.json();

      setTitle(id.name);
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
