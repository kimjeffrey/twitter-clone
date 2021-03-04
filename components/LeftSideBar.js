import Link from 'next/link';
import {signIn, signOut, useSession} from 'next-auth/client'
import { useRouter } from 'next/router';

export default function LeftSideBar() {
  const router = useRouter();
  const [session, loading] = useSession();

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
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><a href="#" onClick={handleProfileClick}>Profile</a></li>
      <li>
        {session && <a href="#" onClick={handleSignout} className="btn-signin">Sign out</a>  } 
        {!session && <a href="#" onClick={handleSignin}  className="btn-signin">Sign in</a>  } 
      </li>
    </ul>
  )
}
