import Link from 'next/link'
import {dev} from '../config'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/client'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faComment as farComment, faHeart as farHeart, faTrashAlt as farTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ReplyForm from './ReplyForm'
import styles from '../styles/Post.module.scss'
import { set } from 'mongoose';

export default function Post(props) {
  const clientPath = dev ? 'http://localhost:3000' : `https://twitter-clone-site.vercel.app`;
  const router = useRouter();
  const [session] = useSession();

  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(props.likes);
  const [numberOfReplies, setNumberOfReplies] = useState(props.replies);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(async () => {
    getUserLikes();
  }, [])

  async function getUserLikes() {
    const res = await fetch(`${clientPath}/api/likes/${session.id}`);
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

  function displayDate() {
    let date = new Date(props.date);

    return date.toLocaleTimeString() + " · " + date.toLocaleDateString()
  }

  async function handleLike() {
    if(liked === false) {
      await fetch(`${clientPath}/api/likes/${props.id}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: session.id})
      })
      setNumberOfLikes((prev) => {
        return prev + 1;
      })
    } else {
      await fetch(`${clientPath}/api/likes/${props.id}`, {
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

  function handleClick(event) {
    if(!event.target.outerHTML.startsWith("<a") && !event.target.outerHTML.startsWith("<h3") && !event.target.outerHTML.startsWith("<svg") && !event.target.outerHTML.startsWith("<path")) {
      router.push(`/post/${props.id}`);
    }
  }

  function handleComment() {
    setShowReplyForm(prev => {
      return !prev;
    })
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
    await fetch(`${clientPath}/api/post/${props.id}`, {
      method: "DELETE",
    });
    router.replace(router.asPath);
  }

  return ( 
    <>
    <div className={!router.asPath.startsWith("/post") ? `${styles.container} ${styles.hover}` : `${styles.container}`} onClick={!router.asPath.startsWith("/post") ? handleClick : undefined}>
      <div className={styles.user}>
        <Link href="/profile/[id]" as={`/profile/${props.user}`}><h3>{props.name}</h3></Link>
        <div className={styles.time}>{getTime()}</div>
      </div>
      <p>{props.content}</p>
      <div className={styles.date}>{router.asPath.startsWith("/post") &&
        displayDate()
      }</div>
      {router.asPath.startsWith("/post") && <>
        <hr/>
        <div className={styles.likes}><b>{numberOfLikes}</b> {numberOfLikes === 1 ? "Like" : "Likes"}</div>
        <hr/>
      </>}
      <div className={styles.icons}>
        <div className={styles.commentContainer}>
          <a className={`${styles.icon} ${styles.comment}`} href="#" onClick={handleComment}>
            <FontAwesomeIcon icon={farComment} />
          </a>
          <div className={styles.commentCount}>
            {numberOfReplies > 0 && !router.asPath.startsWith("/post") && numberOfReplies}
          </div>
        </div>
        <div className={styles.likeContainer}>
          <a className={!liked ? `${styles.icon} ${styles.heart}` : `${styles.icon} ${styles.heartFilled}`} href="#" onClick={handleLike}>
            {!liked && <FontAwesomeIcon icon={farHeart} /> }
            {liked && <FontAwesomeIcon icon={faHeart} /> }
          </a>
          <div className={styles.likes}>
            {numberOfLikes > 0 && !router.asPath.startsWith("/post") && numberOfLikes}
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