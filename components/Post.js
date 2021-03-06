import Link from 'next/link'
import styles from '../styles/Post.module.scss'

export default function Post(props) {

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

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <h3><Link href="/profile/[id]" as={`/profile/${props.id}`}>{props.name}</Link></h3>
        <div className={styles.time}>{getTime()}</div>
      </div>
      <p>{props.content}</p>
      <p className={styles.date}>{displayDate()}</p>
    </div>
  )
}
