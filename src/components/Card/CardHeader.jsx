import { useState } from 'react';

const CardHeader = ({ text, tag = "h1" }) => {

    const [HeaderTag, setHeaderTag] = useState(tag);

    if (tag != HeaderTag) {
        setHeaderTag(tag);
    }

    return (
        <HeaderTag className="card-header">
            {text}
        </HeaderTag>
    )
}

export default CardHeader;
