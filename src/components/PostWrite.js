import axios from "axios";
import $ from "jquery";
import React, { useState, useEffect } from "react";
import "../css/PostMain.css"
import "../css/PostWrite.css"

function PostWrite() {

    const dateFormatter = (data) => {
        if (data < 10) {
            return `0${data + 1}`
        } else {
            return data
        }
    }

    const getBoards = async() => {
        const res = await axios.get(`/api/get/boardinfo`)
        setWriteId(parseInt(res.data.board[res.data.board.length - 1].id + 1))
    };

    const date = new Date(),
    yyyy = date.getFullYear(),
    mm = dateFormatter(date.getMonth()),
    dd = dateFormatter(date.getDate())

    const [acessToAdmin, setAcessToAdmin] = useState('Admindolsot!')
    
    const [postNick, setPostNick] = useState(''),
    [postPassword, setPostPassword] = useState(''),
    [postTitle, setPostTitle] = useState(''),
    [postContent, setPostContent] = useState('')

    const [writePassWord, setWritePassWord] = useState(''),
    [writeId, setWriteId] = useState(''),
    [writeTitle, setWriteTitle] = useState(''),
    [writeContent, setWritecontent] = useState(''),
    [writeIsAdmin, setWriteIsAdmin] = useState('일반'),
    [writeDate, setWriteDate] = useState(`${yyyy}-${mm}-${dd}`),
    [writeNick, setWriteNick] = useState('')

    let pwShow = false;

    const adjustTextareaHeight = () => {
        const textEle = $('.post-content');
        if (Number(textEle[0].style.height.replace("px", "")) >= 850) {
            textEle.css("height", "850px")
            textEle.css("overflow-y", "scroll")
            return
        }
        textEle[0].style.height = 'auto';
        const textEleHeight = textEle.prop('scrollHeight');
        textEle.css('height', textEleHeight);
    }

    const passwordShow = () => {
        const show = $(".pwShowToggle.show")
        const hide = $(".pwShowToggle.hide")
        const post_password = $(".post-password")

        if (pwShow) { // 비밀번호 보이기 상태
            show.show()
            hide.show()
            post_password.attr("type", "password")
            pwShow = false
        } else { // 비밀번호 숨기기 상태
            show.show()
            hide.hide()
            post_password.attr("type", "text")
            pwShow = true
        }
    }

    const chkCharCode = (event) => {
        const regExp = /[^0-9a-zA-Z]/g;
        const ele = event.target;
        if (regExp.test(ele.value)) {
            if (!ele.value.includes(['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'])) {
                return
            }
            ele.value = ele.value.replace(regExp, '');
        }
    };

    const confirmToExit = () => {
        const exitWrite = window.confirm("현재 페이지를 나가면 글 내용도 사라집니다.\n정말로 페이지를 나가시겠습니까?")

        if (exitWrite) {
            window.location.href = "/"
        }
    }

    const post_content = async() => {
        const res = await axios.get(`/api/get/boardinfo`),
        input_nickname = $(".post-nickname"),
        input_password = $(".post-password"),
        input_title = $(".post-title"),
        textarea_content = $(".post-content"),
        cancelBtn = $(".cancel-write"),
        submitBtn = $(".post-to-board")

        if (input_nickname.val() !== '' && input_password.val() !== '' && input_title.val() !== '' && textarea_content.val() !== '') {

            if (input_nickname.val().length <= 12 && input_password.val().length <= 16 && input_title.val().length <= 17) {

                const addPostObj = {
                    password:writePassWord,
                    id:writeId,
                    title:writeTitle,
                    contents:writeContent,
                    isAdmin:writeIsAdmin,
                    postDate:writeDate,
                    author:writeNick,
                    views:0
                }

                cancelBtn.attr("disabled", "disabled").css("opacity", "0.6").css("cursor", "not-allowed")
                submitBtn.attr("disabled", "disabled").css("opacity", "0.6").css("cursor", "not-allowed")
                submitBtn.text("작성 중...")

                await axios.post(`/api/post/boardpost/`, addPostObj).then((res) => {
                    alert("작성되었습니다.")
                    window.location.href = "/"
                })
                .catch((e) => {
                    alert(`글 작성에 실패하였습니다. (자세한 내용은 Console 참고)`)
                    console.log(`글 작성 실패\n\n${e}`)
                })

            } else {
                alert("닉네임, 비밀번호, 제목, 내용은 각각 5자, 16자, 17자, 1024를 넘을 수 없습니다.")
                return
            }

        } else {
            alert("닉네임, 비밀번호, 제목, 내용을 입력했는지 다시 확인해주세요.")
        }
    }

    useEffect(() => { // 닉네임 변경시
        const changeState = async() => {
            const userIpGet = await axios.get(`https://extreme-ip-lookup.com/json`),
            userIp = userIpGet.data.query
            setWriteNick(`${postNick} (${userIp.substring(0, 5)})`)
        }; changeState()
    }, [postNick])

    useEffect(() => { // 비번 변경시
        setWritePassWord(postPassword)
    }, [postPassword]);

    useEffect(() => { // 제목 변경시
        setWriteTitle(postTitle)
    }, [postTitle])

    useEffect(() => { // 내용 변경시
        setWritecontent(postContent)
    }, [postContent])

    useEffect(() => {
        getBoards()
    }, [])

    return (
        <div id="PostWrite">
            <h1 id="title-h1">글 작성</h1>
            <div id="write-area">
                <input type="text" name="post-nickname" placeholder="닉네임" className="input-area post-nickname post-write-input" onChange={(e) => {setPostNick(e.target.value)}} maxLength="12"/>
                <span className="input-icon-relative">
                    <input type="password" name="post-password" placeholder="비밀번호" className="input-area post-password post-write-input" onChange={(e) => {
                        setPostPassword(e.target.value);
                        if (e.target.value === acessToAdmin) {
                            setWriteIsAdmin("관리자")
                        } else {
                            setWriteIsAdmin("일반")
                        }
                    }} onKeyUp={chkCharCode} maxLength="16"/>
                    <span style={{marginLeft:"10px", fontSize:"12px", color:"red", userSelect:"none", cursor:"text"}}>* 쉬운 비밀번호를 사용하면 글이 다른사람에 의해 삭제될수도 있습니다.</span>
                    <i className="fa-solid fa-eye pwShowToggle show" onClick={passwordShow}></i>
                    <i className="fa-solid fa-eye-slash pwShowToggle hide" onClick={passwordShow}></i>
                </span>
                <input type="text" name="post-title" placeholder="제목을 입력해 주세요." className="input-area post-title post-write-input" onChange={(e) => {setPostTitle(e.target.value)}} maxLength="17"/>
                <textarea name="content" className="post-content" onKeyDown={adjustTextareaHeight} placeholder="글 내용을 입력하세요. 박스 크기는 알아서 조정되니 마음껏 입력하세요 (1024자 제한)" maxLength="1024" spellCheck="false" onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                <div className="buttons-post">
                    <button className="cancel-write" onClick={confirmToExit}>취소</button>
                    <button className="post-to-board" onClick={() => {post_content();}}>작성</button>
                </div>
            </div>

        </div>
    )
}

export default PostWrite;