import {server} from '../config'
import {useSession} from 'next-auth/client'
import {useState} from 'react'

export default function Tweet() {
  const [session] = useSession();

  const [content, setContent] = useState("");

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
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="content" value={content} onChange={handleChange} id="" cols="50" rows="6"></textarea><br/>
      <button type="submit">Tweet</button>
    </form>
  )
}
