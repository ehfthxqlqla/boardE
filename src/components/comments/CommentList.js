import React, { useState } from "react";
import Comment from "./Comment.js";

function CommentList(props) {
    const commentResult = props.commentJson.map(
        (comment) => (<Comment key={comment.id} id={comment.id} author={comment.author} content={comment.contents} date={comment.commentDate}/>)
    )

    return (
        <div id="CommentList">
            {commentResult}
        </div>
    )
}

export default CommentList;