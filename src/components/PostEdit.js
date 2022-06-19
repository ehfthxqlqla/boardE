import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import queryString from "query-string";
import "../css/PostEdit.css"

let authorized = false;

function PostEdit() {

    const [postTitle, setPostTitle] = useState(''),
    [postContent, setPostContent] = useState('')

    const [EditId, setEditId] = useState(''),
    [editTitle, setEditTitle] = useState(''),
    [editContent, setEditContent] = useState('')

    const [acessToAdmin, setAcessToAdmin] = useState('Admindolsot!')

    const authorize = async(input) => {
        const password = input,
        real_password_get = await axios.get(`/api/get/boardWithId/${queryString.parse(window.location.search).id}`),
        real_password = real_password_get.data.extract[0].postPassword

        console.log(real_password)

        if (password === '' || password === ' ') {
            alert("비밀번호를 입력해 주세요.")
        } else if (password === real_password) {
            authorized = true
            reactUseEffectFunction();
            Array.from(document.getElementsByClassName("editBtn")).forEach((element) => {
                element.classList.remove("inactive")
                element.removeAttribute("disabled")
            })
            document.getElementById("pwcheckbg").style.display = "none"
        } else {
            alert("비밀번호가 다릅니다.")
        }
    }

    const adjustTextareaHeight = () => {
        const textEle = $('.edit-content');
        if (Number(textEle[0].style.height.replace("px", "")) >= 850) {
            textEle.css("height", "850px")
            textEle.css("overflow-y", "scroll")
            return
        }
        textEle[0].style.height = 'auto';
        const textEleHeight = textEle.prop('scrollHeight');
        textEle.css('height', textEleHeight);
    }

    const confirmToExit = () => {
        const exitWrite = window.confirm("현재 페이지를 나가면 글 내용도 사라집니다.\n정말로 페이지를 나가시겠습니까?")

        if (exitWrite) {
            window.location.href = "/"
        }
    }

    const edit_content = async() => {

        if (!authorized) {
            console.log(authorized)
            alert("비밀번호를 입력해 주세요. (새로고침 필요)\n미친놈아 지금 패스워드 입력없이 수정하려고?")
            return
        }

        if (window.confirm(`글을 수정하면 되돌릴 수 없습니다. 정말로 이 게시물을 수정하시겠습니까?`)) {/* 암것도 안함 */} else {
            return
        }

        const input_title = $(".edit-title"),
        textarea_content = $(".edit-content"),
        cancelBtn = $(".cancel-write"),
        submitBtn = $(".post-to-board")

        if (input_title.val() !== '' && textarea_content.val() !== '') {

            if (input_title.val().length <= 17 && textarea_content.val().length <= 1024) {

                const editPostObj = {
                    id:EditId,
                    title:input_title.val(),
                    content:textarea_content.val()
                }

                cancelBtn.attr("disabled", "disabled").css("opacity", "0.6").css("cursor", "not-allowed")
                submitBtn.attr("disabled", "disabled").css("opacity", "0.6").css("cursor", "not-allowed")
                submitBtn.text("작성 중...")

                await axios.post(`/api/post/editBoard`, editPostObj).then(() => {
                    alert("수정되었습니다.")
                    window.location.href = "/"
                })
                .catch((e) => {
                    alert(`글 수정에 실패하였습니다. (자세한 내용은 Console 참고)`)
                    console.error(`글 수정 실패\n\n${e}`)
                })

            } else {
                alert("제목, 내용은 17자, 1024자를 넘을 수 없습니다.")
                return
            }

        } else {
            alert("닉네임, 비밀번호, 제목, 내용을 입력했는지 다시 확인해주세요.")
        }
    }

    useEffect(() => { // 제목 변경시
        setEditTitle(postTitle)
    }, [postTitle])

    useEffect(() => { // 내용 변경시
        setEditContent(postContent)
    }, [postContent])

    const reactUseEffectFunction = () => {

        if (!authorized) {
            return
        }

        setEditId(queryString.parse(window.location.search).id)

        const getBoards = async(id) => {
            const res = await axios.get(`/api/get/boardWithId/${id}`).catch((err) => {
                alert(`글을 찾을 수 없습니다.`)
                console.error(err)

                window.location.href = "/"
            })

            const titleInput = document.getElementsByClassName("input-area")[0]
            titleInput.value = res.data.extract[0].title
            authorized ? titleInput.focus() : document.getElementsByClassName("pw-input")[0].focus();

            const contentInput = document.getElementsByClassName("edit-content")[0]
            contentInput.value = res.data.extract[0].contents

            document.title = `${res.data.extract[0].title} - 게시판`
        }; getBoards(queryString.parse(window.location.search).id)

        window.onload = () => {
            adjustTextareaHeight()
        }
    }

    useEffect(reactUseEffectFunction, [])

    return (

        <div id="PostWrite">
            <div className="check-pw-bg" id="pwcheckbg">
                <div className="check-pw">
                    <h2>비밀번호를 입력하세요.</h2>
                    <input 
                    type="password"
                    className="pw-input post-edit-input"
                    maxLength={16}
                    onKeyDown={(e) => {if (e.key === "Enter") { authorize(e.target.value) }}}
                    />
                    <br/>
                    <button className="pw-cancel" onClick={(e) => {}}>취소</button>
                    <button className="pw-confirm" onClick={(e) => {authorize(e.target.parentElement.children[1].value)}}>확인</button>
                </div>
            </div>
            {/* 아래는 글 수정, 위는 비밀번호 확인 */}
            <h1 id="title-h1">글 수정</h1>
            <div id="edit-area">
                <input type="text" name="post-title" placeholder="제목을 입력해 주세요." className="input-area edit-title post-edit-input" onChange={(e) => {setPostTitle(e.target.value)}} maxLength="17" autoComplete="false"/>
                <textarea name="content" className="edit-content" onKeyDown={adjustTextareaHeight} placeholder="글 내용을 입력하세요. 박스 크기는 알아서 조정되니 마음껏 입력하세요 (1024자 제한)" maxLength="1024" spellCheck="false" onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                <div className="buttons-post">
                    <button className="cancel-write inactive editBtn" onClick={() => {confirmToExit()}}>취소</button>
                    <button className="post-to-board inactive editBtn" onClick={() => {edit_content();}}>작성</button>
                </div>
            </div>

        </div>
    )
}

export default PostEdit;