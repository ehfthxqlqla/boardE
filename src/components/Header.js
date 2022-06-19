import React, { useState } from "react";
import "../css/Post-Header.css"

function Header(props) {
    return (
        <span className="Header">
            <span className="header"></span>
            <span className="headerId headerArea">{props.id}</span>
            <span className="headerTitle headerArea">{props.title}</span>
            <span className="headerIsAdmin headerArea">{props.isAdmin}</span>
            <span className="headerDate headerArea">{props.date}</span>
            <span className="headerAuthor headerArea">{props.author}</span>
            <span className="headerViews headerArea">{props.views}</span>
            <br/>
        </span>
    )
}

export default Header;