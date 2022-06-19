import React from 'react';
import Linky from 'react-linky';

function Comment(props) {
    return (
        <div className="commentBox">
            <span className="commentId" style={{display:"none"}}>{props.id}</span>
            <span className="commentAuthor commentText">{props.author}</span>
            <span className="commentDate commentText">{props.date}</span>
            <br/>
            <pre>
                <Linky>
                    <span className="commentContent commentText">{props.content.replace("https", "http").split("http://")}</span>
                </Linky>
            </pre>
        </div>
    )
}

export default Comment;