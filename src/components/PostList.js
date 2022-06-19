import React, { useState } from 'react';
import Post from './Post.js';
import Header from './Header.js';
import "../css/PostList.css"

function PostList(props) {

    //const jsonContentArray = props.jsonContent
    const result = props.jsonContent.map(
        (writing) => (<Post key={writing.id} id={writing.id} title={writing.title} isAdmin={writing.isAdmin} date={writing.postDate} author={writing.author} views={writing.views}/>)
    )

    const header = props.postInformationJsonContent.map(
        (header) => (<Header key={header} id={header.id} title={header.title} isAdmin={header.isAdministrator} date={header.date} author={header.author} views={header.views}/>)
    )

    return (
        <div id="PostList">
            {header}
            {result}
        </div>
    )
}

export default PostList