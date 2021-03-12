import {useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/client'
import {dev} from '../config'
import styles from '../styles/ReplyForm.module.scss'

export default function ReplyForm(props) {
  const clientPath = dev ? 'http://localhost:3000' : `https://twitter-clone-site.vercel.app`;
  const router = useRouter();
  const [session] = useSession(); 

  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    handleDisable();
  }, [content])

  function handleChange(event) {
    setContent(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch(`${clientPath}/api/reply`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({content, user: session.id, post: props.id})
    });
    setContent("");
    router.replace(router.asPath);
  }

  function handleDisable() {
    if(content.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
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

  return (
  <>
    <div className={styles.container}>
      <div className={styles.userPost}>
        <div className={styles.user}>
          <h3>{props.name}</h3>
          <div className={styles.time}>{getTime()}</div>
        </div>
        <p>{props.content}</p>
      </div>
      <div className={styles.replyingTo}>
        Replying to {props.name}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea name="content" className={styles.textarea} value={content} onChange={handleChange} placeholder="Tweet your reply" id="" cols="45" rows="2"></textarea><br/>
        <div className={styles.buttonHolder}>
          <button type="submit" disabled={disabled} className={styles.button}>Reply</button>
        </div>
      </form>
    </div>
    
  </>
  )
}
