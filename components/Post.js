import Link from 'next/link'
import {server} from '../config'
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/client'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faComment as farComment, faHeart as farHeart, faTrashAlt as farTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from '../styles/Post.module.scss'

export default function Post(props) {
  const router = useRouter();
  const [session] = useSession();

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

  async function handleDelete(event) {
    event.preventDefault();
    await fetch(`${server}/api/user/${session.id}`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(props.postId)
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <h3><Link href="/profile/[id]" as={`/profile/${props.id}`}>{props.name}</Link></h3>
        <div className={styles.time}>{getTime()}</div>
      </div>
      <p>{props.content}</p>
      <p className={styles.date}>{displayDate()}</p>
      <div className={styles.icons}>
        <a className={styles.icon} href="#">
          <FontAwesomeIcon icon={farComment} />
        </a>
        <a className={styles.icon} href="#">
          <FontAwesomeIcon icon={farHeart} />
        </a>
        {session.id === props.id &&
          <a className={styles.icon} href="#" onClick={handleDelete}>
          <FontAwesomeIcon icon={farTrashAlt} />
          </a>
        }
      </div>
    </div>
  )
}
