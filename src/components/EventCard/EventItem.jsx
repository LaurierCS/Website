import React from 'react';
import './EventItem.css';
import EventTag from '../EventTag/EventTag';

// Item Component:
/*
    Component Details:
    - handles state updates for event and event tags
*/

class EventItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [], // array of tags to be updated with state
        };
    }

    // Updates Tag array
    addTag(tag) {
        let currentTags = this.state.tags;
        currentTags.push(tag);
        this.setState({ tags: currentTags });
    }

    render() {
        return (
            <div className="event_item">
                <h1>{props.title}</h1>
                {this.state.tags.map((tag, key) => {
                    return (
                        <div className="item_tags" key={key}>
                            {tag}
                        </div>
                    ); // creates a tag component
                })}
            </div>
        );
    }
}

export default EventItem;
