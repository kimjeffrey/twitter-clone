import Link from 'next/link'
import {server} from '../config'
import {useState} from 'react'
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/client'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faComment as farComment, faHeart as farHeart, faTrashAlt as farTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from '../styles/Post.module.scss'

export default function Post(props) {
  const router = useRouter();
  const [session] = useSession();

  const [liked, setLiked] = useState(false);

  function getTime() {
    let currentTime = new Date();
    let postTime = new Date(props.date);

    let secondsPassed = (currentTime - postTime) / 1000;
    let finalValue = 0;
    let unitOfTime = "";
    if(secondsPassed < 60) {
      finalValue = secondsPassed;
      unitOfTime = "s";
    } else if(secondsPassed < 3600) {
      finalValue = secondsPassed / 60;
      unitOfTime = "m";
    } else if(secondsPassed < 86400) {
      finalValue = secondsPassed / 3600;
      unitOfTime = "h";
    } else {
      return postTime.toDateString().slice(4, 10)
    }

    return Math.floor(finalValue) + unitOfTime;
  }

  function displayDate() {
    let date = new Date(props.date);

    return date.toLocaleTimeString() + " • " + date.toLocaleDateString()
  }

  function handleLike() {
    setLiked((prev) => {
      return !prev;
    })
  }

  function handleClick(event) {
    if(!event.target.outerHTML.startsWith("<a") && !event.target.outerHTML.startsWith("<svg") && !event.target.outerHTML.startsWith("<path")) {
      router.push(`/post/${props.id}`);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    await fetch(`${server}/api/post/${props.id}`, {
      method: "DELETE",
    });
    router.replace(router.asPath);
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.user}>
        <Link href="/profile/[id]" as={`/profile/${props.id}`}><h3>{props.name}</h3></Link>
        <div className={styles.time}>{getTime()}</div>
      </div>
      <p>{props.content}</p>
      <div className={styles.date}>{router.asPath.startsWith("/post") &&
        displayDate()
      }</div>
      <div className={styles.icons}>
        <a className={`${styles.icon} ${styles.comment}`} href="#">
          <FontAwesomeIcon icon={farComment} />
        </a>
        <a className={!liked ? `${styles.icon} ${styles.heart}` : `${styles.icon} ${styles.heartFilled}`} href="#" onClick={handleLike}>
          {!liked && <FontAwesomeIcon icon={farHeart} /> }
          {liked && <FontAwesomeIcon icon={faHeart} /> }
        </a>
        {session.id === props.user &&
          <a className={`${styles.icon} ${styles.trash}`} href="#" onClick={handleDelete}>
          <FontAwesomeIcon icon={farTrashAlt} />
          </a>
        }
      </div>
      
    </div>
  )
}
