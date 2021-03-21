import {dev} from '../config'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/client'
import {useEffect, useState} from 'react'
import styles from '../styles/Tweet.module.scss'

export default function Tweet() {
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
    if(content.length > 280) {
      return;
    }
    await fetch(`${clientPath}/api/post`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({content, user: session.id})
    });
    setContent("");
    router.replace(router.asPath);
  }

  function handleDisable() {
    if(content.length > 0 && content.length <= 280) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea name="content" className={styles.textarea} value={content} onChange={handleChange} placeholder="What's happening?" id="" cols="45" rows="2"></textarea><br/>
      <div className={styles.buttonHolder}>
        <div className={content.length > 280 ? `${styles.charCount} ${styles.error}` : styles.charCount}>
          {content.length > 0 && `${content.length} / 280`}
        </div>
        <button type="submit" disabled={disabled} className={styles.button}>Tweet</button>
      </div>
    </form>
  )
}
