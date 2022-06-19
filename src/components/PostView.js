import React, { useState, useEffect } from "react";
import queryString from 'query-string'
import axios from "axios";
import "../css/PostView.css";
import CommentMain from "./comments/CommentMain.js";
import $ from 'jquery';

function PostView() {

    const [viewId, setViewId] = useState(''),
    [viewTitle, setViewTitle] = useState(''),
    [viewContent, setViewContent] = useState(''),
    [viewIsAdmin, setViewIsAdmin] = useState(''),
    [viewDate, setViewDate] = useState(''),
    [viewNick, setViewNick] = useState(''),
    [viewViews, setViewViews] = useState(''), // viewViews는 조회수를 뜻함 (이게뭐냐)
    adminEmail = "mailto:0909aiden@naver.com",
    [commentsLength, setCommentsLength] = useState('로딩중...')

    const notFoundJSX = (
        <div id="PostView">
            <h2 className="error-h2">오류</h2>
            <div id="Notfoundview">
                <h2>502 Web server down</h2>
            </div>
            <div id="howtosolve">
                <span>SQL 서버가 다운되었습니다. (트래픽 초과 또는 미 실행)</span>
                <br/>
                <span>
                    <a href={adminEmail} onClick={() => {

                        if (!navigator.clipboard) {
                            console.log("네비게이터 사용불가능")
                            // 클립보드가 작동안될때
                            const copyText = document.createElement("textarea")
                            copyText.style.position = "absolute"
                            copyText.style.top = "9999px"
                            document.body.appendChild(copyText)
                            copyText.value = "0909aiden@naver.com"
                            copyText.select()
                            copyText.setSelectionRange(0, 99999)
                            document.execCommand("copy")
                        } else {
                            console.log("네비게이터 사용가능")
                            navigator.clipboard.writeText("0909aiden@naver.com")
                        }

                    }}>
                        <code>0909aiden@naver.com</code>
                    </a>
                    &nbsp;으로 문의주세요.
                </span>


                <a href="#" onClick={() => {
                    window.history.back()
                    return false;
                }} className="notfoundanchor">돌아가기</a>

                <a href="/" className="notfoundanchor">홈으로</a>

                <a href="/write" className="notfoundanchor">글 작성</a>

            </div>
        </div>
    ),
    serverDownJSX = (<div id="PostView">
        <div id="Notfoundview">
            <h2>404 Not Found</h2>
        </div>
        <div id="howtosolve">
            <span>게시물을 찾을 수 없습니다. (삭제되었거나 알 수 없는 주소)</span>
            <br/>
            <span>url에 <code>?id</code> 값이 잘 들어 갔는지 확인해주세요.</span>


            <a href="#" onClick={() => {
                window.history.back()
                return false;
            }} className="notfoundanchor">돌아가기</a>

            <a href="/" className="notfoundanchor">홈으로</a>

            <a href="/write" className="notfoundanchor">글 작성</a>

        </div>
    </div>)

    const qString = window.location.search
    const parsedQueryString = queryString.parse(qString)

    const copyToClipboard = (link) => {
        if (!navigator.clipboard) {
            console.log("네비게이터 사용불가능")
            // 클립보드가 작동안될때
            const copyText = document.createElement("textarea")
            copyText.style.position = "absolute"
            copyText.style.top = "9999px"
            document.body.appendChild(copyText)
            copyText.value = link
            copyText.select()
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy")
            alert("복사되었습니다.")
        } else {
            console.log("네비게이터 사용가능")
            navigator.clipboard.writeText(link).then(() => {
                alert("복사되었습니다.")
            }).catch((error) => {
                alert(`복사 실패 : ${error}`)
            })
        }
    }

    const writeComment = async(e) => {
        const res = await axios.get(`https://extreme-ip-lookup.com/json`),
        id = e.target.parentElement.parentElement.parentElement.children[3].children.length,
        webId = queryString.parse(window.location.search).id,
        author_noip = e.target.parentElement.parentElement.parentElement.children[2].children[0].value,
        password = e.target.parentElement.parentElement.parentElement.children[2].children[1].value,
        content = e.target.parentElement.parentElement.parentElement.children[2].children[2].children[0].value,
        author = `${author_noip} (${res.data.query.toString().substring(0, 5)})`;

        if (author_noip === '' || password === '' || content === '') {
            alert(`작성자, 비밀번호, 내용을 입력하였는지 다시 한번 확인해주세요.`)
            return
        } else if (author_noip.length > 25 || password.length > 16 || content.length > 300) {
            alert(`작성자, 비밀번호, 내용은 각각 25자, 16자, 300자를 넘을 수 없습니다.`)
            return
        }

        const date = new Date(),
        yyyy = date.getFullYear(),
        mm = parseInt(date.getMonth()) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`,
        dd = parseInt(date.getDate()) < 10 ? `0${date.getDate()}` : `${date.getDate()}`

        const sendObject = {
            id:id,
            webid:webId,
            author:author,
            password:password,
            contents:content,
            commentDate:`${yyyy}-${mm}-${dd}`
        }

        $(".submit-comment").attr("disabled", "disabled").css("opacity", "0.6").css("cursor", "not-allowed").text("작성중..")

        await axios.post(`/api/post/writeComment`, sendObject).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        })
    }

    const deletePost = async(e) => {
        const id = parsedQueryString.id,
        user_password = e.target.parentElement.parentElement.children[1].value,
        board_res = await axios.get(`/api/get/boardWithId/${id}`),
        board_password = board_res.data.extract[0].postPassword

        if (user_password === board_password) {
            if (!window.confirm(`삭제한 게시물은 복구할 수 없습니다. 정말로 계속하시겠습니까?`)) {
                alert(`삭제를 취소합니다.`)
                return
            }

            await axios.delete(`/api/delete/boardDel`, {
                delId:id
            })
            .then(() => {
                alert(`삭제되었습니다. - ${document.title}`)
                window.location.href = "/"
            })
            .catch((error) => {
                alert(`오류가 발생했습니다.`)
                console.error(error)
            })
        } else {
            alert("비밀번호가 다릅니다.")
        }
    }

    useEffect(() => {
        const postView_load = async() => {
            const res = await axios.get(`/api/get/boardWithId/${parsedQueryString.id}`)

            setViewId(res.data.extract[0].id)
            setViewTitle(res.data.extract[0].title)

            setViewContent(res.data.extract[0].contents)

            if (res.data.extract[0].isAdmin === "관리자") {
                setViewIsAdmin("관리자")
            }

            setViewDate(res.data.extract[0].postDate)
            setViewNick(res.data.extract[0].author)
            setViewViews(res.data.extract[0].views)

            document.title = `${res.data.extract[0].title} - 게시판`
        }; postView_load()

        window.document.body.classList.add("contentCenter")

        window.setTimeout(() => {
            setCommentsLength(document.querySelectorAll(".commentId").length)
            
            const commentAtag = document.querySelectorAll(".comments .commentContent a"),
            postViewAtag = document.querySelectorAll(".content pre a")

            Array.from(commentAtag).forEach((element) => {
                element.target = "_blank"
            })

            Array.from(postViewAtag).forEach((element) => {
                element.target = "_blank"
            })
        }, 1500)
    }, [])

    if (!parsedQueryString.id) {
        return (notFoundJSX)
    } else if (!viewId) {
        return (notFoundJSX)
    } else if (parsedQueryString.id === -1) {
        return (serverDownJSX)
    }

    return (
        <div id="PostView">
            <div className="title">
                <span>{viewTitle}</span>
            </div>
            <div className="author">
                <span id="nickname">{viewNick} </span>
                {viewIsAdmin ? <i className="fa-solid fa-crown" style={{color:"#FFD700"}} title="관리자"></i> : <i className="fa-solid fa-user-tie" title="일반"></i>}
                <span id="date">{viewDate}</span>
                <span id="view">조회 <span>{viewViews}</span></span>
                <span id="delete" onClick={(e) => {e.target.parentElement.parentElement.children[5].style.display = "block"}}>삭제</span>
                <a id="edit" href={`/edit?id=${parsedQueryString.id}`}>수정</a>
            </div>
            <div className="content">
                <pre> {/* 공백과 \n 기준으로 분리 (/,| |\n/) */}
                {/* .replace("\n", "backslash_n_replace_with_this_string_and_will_changed_to_backslash_n_").split("backslash_n_replace_with_this_string_and_will_changed_to_backslash_n_") 이것도 나쁘지 않음 */}
                    {viewContent}
                </pre>
            </div>

            <div className="menu">
                {/* <span id="like">추천 <i className="fa-solid fa-arrow-down"></i></span>
                <i className="fa-solid fa-arrow-up"></i> */}
                {/* 추후 개추/비추 사용예정 */}
                <i className="fa-solid fa-share-nodes" title="복사하기" onClick={() => {copyToClipboard(window.location.href);}}></i>
            </div>

            <div className="comments">
                <span style={{position:"absolute"}}>총 댓글수 <b>{commentsLength}</b>개</span>
                <span className="comments-border" style={{
                    width:"1200px",
                    height:"1px",
                    display:"inline-block",
                    backgroundColor:"#cccccc",
                    position:"absolute",
                    top:"27px"
                }}></span>
                <div className="commentWrite">
                    <input
                        type="text"
                        className="comment-author post-write-input"
                        maxLength="25"
                        placeholder="닉네임"
                    />
                    <input
                        type="password"
                        className="comment-password post-write-input"
                        maxLength="16"
                        placeholder="비밀번호"
                    />
                    <div className="writeTextArea">
                        <textarea
                            className="write-comment"
                            maxLength="300"
                            placeholder="댓글"
                        ></textarea>
                        <button className="submit-comment" onClick={(e) => {writeComment(e)}}>작성</button>
                    </div>
                </div>
                <CommentMain/>
            </div>
            <div className="popup-background postview-bg">
                <div className="enter-password">
                    <h2>비밀번호를 입력하세요.</h2>
                    <input type="password" className="password-input" autoComplete="false"/>
                    <div className="button-area">
                        <button className="cancel-del" onClick={(e) => {e.target.parentElement.parentElement.parentElement.parentElement.children[5].style.display = "none"}}>취소</button>
                        <button className="del-postboard" onClick={(e) => {deletePost(e)}}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostView;