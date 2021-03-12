import Link from 'next/link'
import {dev} from '../config'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/client'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart, faTrashAlt as farTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ReplyForm from './ReplyForm'
import styles from '../styles/Reply.module.scss'

export default function Reply(props) {
  const clientPath = dev ? 'http://localhost:3000' : `https://twitter-clone-site.vercel.app`;
  const router = useRouter();
  const [session] = useSession();

  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(props.likes);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(async () => {
    getUserLikes();
  }, [])

  async function getUserLikes() {
    const res = await fetch(`${clientPath}/api/likesReply/${session.id}`);
    const userLikes = await res.json();

    if(!userLikes.message && userLikes.includes(props.id)) {
      setLiked(true);
    }
  }

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

  async function handleLike() {
    if(liked === false) {
      await fetch(`${clientPath}/api/likesReply/${props.id}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: session.id})
      })
      setNumberOfLikes((prev) => {
        return prev + 1;
      })
    } else {
      await fetch(`${clientPath}/api/likesReply/${props.id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: session.id})
      })
      setNumberOfLikes((prev) => {
        return prev - 1;
      })
    }
    setLiked((prev) => {
      return !prev;
    });
    
  }

  function handleFocus(event) {
    if(event.target.outerHTML.startsWith("<div class=\"Post_replyContainer")) {
      setShowReplyForm(prev => {
        return !prev;
      })
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    await fetch(`${clientPath}/api/reply/${props.id}`, {
      method: "DELETE",
    });
    router.replace(router.asPath);
  }

  return ( 
    <>
    <div className={`${styles.container}`}>
      <div className={styles.user}>
        <Link href="/profile/[id]" as={`/profile/${props.user}`}><h3>{props.name}</h3></Link>
        <div className={styles.time}>{getTime()}</div>
      </div>
      <p>{props.content}</p>
      <div className={styles.icons}>
        <div className={styles.likeContainer}>
          <a className={!liked ? `${styles.icon} ${styles.heart}` : `${styles.icon} ${styles.heartFilled}`} href="#" onClick={handleLike}>
            {!liked && <FontAwesomeIcon icon={farHeart} /> }
            {liked && <FontAwesomeIcon icon={faHeart} /> }
          </a>
          <div className={styles.likes}>
            {numberOfLikes > 0 && numberOfLikes}
          </div>
        </div>
        {session.id === props.user &&
          <a className={`${styles.icon} ${styles.trash}`} href="#" onClick={handleDelete}>
          <FontAwesomeIcon icon={farTrashAlt} />
          </a>
        }
      </div>
    </div>
    {showReplyForm && 
      <div className={styles.replyContainer} onClick={handleFocus}>
        <div className={styles.reply}>
          <ReplyForm id={props.id} user={props.user} name={props.name} content={props.content} date={props.date.toString()} />
        </div>
      </div>
    }
    </>
  )
}