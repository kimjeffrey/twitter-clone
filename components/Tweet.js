import {server} from '../config'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/client'
import {useEffect, useState} from 'react'
import styles from '../styles/Tweet.module.scss'

export default function Tweet() {
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
    await fetch(`${server}/api/user/${session.id}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(content)
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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea name="content" className={styles.textarea} value={content} onChange={handleChange} placeholder="What's happening?" id="" cols="45" rows="2"></textarea><br/>
      <div className={styles.buttonHolder}>
        <button type="submit" disabled={disabled} className={styles.button}>Tweet</button>
      </div>
    </form>
  )
}
