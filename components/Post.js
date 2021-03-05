import Link from 'next/link'

export default function Post(props) {
  return (
    <div className="post-container">
      <div className="user-info">
        <i className="far fa-user"></i>
        <h3><Link href="/profile/[id]" as={`/profile/${props.id}`}>{props.name}</Link></h3>
      </div>
      <p>{props.content}</p>
      <p className="time-and-date">{props.date}</p>
    </div>
  )
}
