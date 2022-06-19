import React, { useState, useEffect } from 'react';
import CommentList from './CommentList.js';
import axios from 'axios';
import { parse as qsParse } from 'query-string'

function CommentMain() {
    const [comment, setComment] = useState([
        {id:0, author:"SYSTEM", commentPW:"Admindolsot!",contents:"댓글이 없습니다.\n첫 댓글을 달아 대화를 시작하세요.", commentDate:"1972-11-21"},
    ]),
    postId =  qsParse(window.location.search).id

    useEffect(() => {
        const axios_comments = async() => {
            const res = await axios.get(`/api/get/getComments/${postId}`)
            console.log(res.data.data)
            if (res.data.data.length <= 0) {
                return
            }
            setComment(res.data.data)
        }; axios_comments()
    }, [])

    return (
        <CommentList commentJson={comment}/>
    )
}

export default CommentMain;