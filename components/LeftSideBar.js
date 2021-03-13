import Link from 'next/link'
import {useEffect, useState} from 'react'
import {signIn, signOut, useSession} from 'next-auth/client'
import {useRouter} from 'next/router';
import {faDove, faHome, faUser, faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from '../styles/LeftSideBar.module.scss'

export default function LeftSideBar({href}) {
  const router = useRouter();
  const [session, loading] = useSession();

  const [profileBool, setProfileBool] = useState(false);

  useEffect(() => {
    if(session){
      if(router.query.id === session.id) {
        setProfileBool(true);
      } else {
        setProfileBool(false);
      }
    }
  }, [router.pathname])

  function handleSignin(event) {
    event.preventDefault()
    signIn()
  }    
  function handleSignout(event) {
    event.preventDefault()
    signOut()
  } 
  function handleProfileClick(event) {
    event.preventDefault()
    if(session) {
      router.push(`/profile/${session.id}`);
    } else {
      signIn();
    }
  }

  return (
    <ul className={styles.navbar}>
      <li className={styles.icon}>
       <Link href="/">
          <a>
           <FontAwesomeIcon icon={faDove} />
          </a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link href="/">
          <a className={router.pathname === "/" ? styles.selected : undefined}>
            <FontAwesomeIcon icon={faHome} />
            <div className={styles.label}>Home</div>
          </a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <a href="#" className={profileBool ? styles.selected : undefined} onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUser} />
          <div className={styles.label}>Profile</div>
        </a>
      </li>
      <li className={styles.navItem}>
        {session && 
          <a href="#" onClick={handleSignout} className="btn-signin">
            <FontAwesomeIcon icon={faSignInAlt} />
            <div className={styles.label}>Sign out</div>
          </a>  
        } 
        {!session && 
          <a href="#" onClick={handleSignin}  className="btn-signin">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <div className={styles.label}>Sign in</div>
          </a>  
        } 
      </li>
    </ul>
  )
}
