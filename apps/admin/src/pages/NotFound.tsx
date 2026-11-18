import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        <Link to="/events">Back to Events</Link>
      </p>
    </>
  )
}
