import LeftSideBar from './LeftSideBar'
import Meta from './Meta'
import {signIn, useSession} from 'next-auth/client'
import styles from '../styles/Layout.module.scss'

export default function Layout({children}) {
  const [session, loading] = useSession();

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
          <h1>Page Title</h1>
          {!session && 
          <button onClick={handleSignIn}>Sign in</button>
          }
          {session &&
            <>{children}</>
          }
        </div>
      </div>
    </>
  )
}
