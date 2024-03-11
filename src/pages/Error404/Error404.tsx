import { Link } from 'react-router-dom';
import { Button } from '@mantine/core'; 
import './Error404.css';

const Error404 = () => {
  return (
    <div className="error-404-container">
      <h1>404 Not Found</h1>
      <p>This is not the page you are looking for</p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
          style={{ marginTop: '20px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        >
          Come Home ❤️
        </Button>
      </Link>
    </div>
  );
};

export default Error404;
