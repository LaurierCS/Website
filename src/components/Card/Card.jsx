import './Card.css';
import CardHeader from './CardHeader';

const Card = ({ children }) => {
    return (
        <div className='card-container'>
            {children}
        </div>
    )
}

Card.CardHeader = CardHeader;

export default Card;
