import React, { useState } from "react";
import axios from "axios";
import "../css/Post.css"

function Post(props) {

    const [acessToAdmin, setAcessToAdmin] = useState('Admindolsot!')

    const preventEvent = (e) => {
        e.preventDefault()
    }

    const increaseViews_moveToPost = async(e) => {
        const id = e.target.parentElement.children[0].innerText
        const boardViews = await axios.patch(`/api/patch/viewUpdate/${id}`)
        .then(async() => {
        
            await axios.patch(`/api/patch/viewUpdate/${id}/${boardViews.data.extract[0].views}`)
            .then(() => {
                window.location.href = `/view?id=${id}`
            })

        })
        .catch((error) => {
            console.error(error)
            window.location.href = `/view?id=${id}`
        });
    }

    const ctxMenu_MoveToPost = (e) => {
        const id = e.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText // li -> ul -> div -> span의 자식요소 id를 얻기
        window.location.href = `/view?id=${id}`
    }

    const showDelPopup = (e) => {
        // const nodes = [...e.target.parentElement.children];
        // const index = Number(nodes[0].textContent)

        e.target.parentElement.parentElement.parentElement.parentElement.children[8].style.display = "block"
        console.log(e.target.parentElement.parentElement.parentElement.parentElement.children[8])
    }

    const hideDelPopup = (e) => {
        e.target.parentElement.parentElement.style.display = "none"
    }

    const delPost = (e) => {

        const isPwMatch = async() => {
            const id = parseInt(e.target.parentElement.parentElement.parentElement.children[0].innerText) - 1,
            res = await axios.get(`/api/get/boardWithId/${id + 1}`),
            password = res.data.extract[0].postPassword,
            val = e.target.parentElement.children[1].value

            if (val === password || val === acessToAdmin) {
                let confirmToDelete;
                if (val === acessToAdmin) {
                    confirmToDelete = window.confirm(`(관리자 모드) 삭제한 게시물은 복구 할 수 없습니다.\n정말로 이 게시물을 삭제하시겠습니까?`)
                } else {
                    confirmToDelete = window.confirm(`삭제한 게시물은 복구 할 수 없습니다.\n정말로 이 게시물을 삭제하시겠습니까?`)
                }

                if (confirmToDelete) {
                    await axios.delete(`/api/delete/boardDel/`, {
                        data:{
                            delId:id + 1
                        }
                    }).then(() => {
                        alert("삭제되었습니다.")
                        window.location.reload()
                    }).catch((error) => {
                        alert("삭제하지 못했습니다.")
                        console.error(error)
                    });
                } else {
                    alert(`삭제를 취소합니다.`)
                    hideDelPopup(e)
                }
            } else if (val === '' || val === ' ') {
                alert("비밀번호를 입력해 주세요.")
            } else {
                alert(`비밀번호가 다릅니다.`)
            }
        }
        isPwMatch()
    }

    const contextMenu = (e) => {
        e.preventDefault()

        const hideAll = document.getElementsByClassName("contextMenu")

        Array.from(hideAll).forEach((element) => {
            element.style.display = "none"
        })

        e.target.parentElement.children[6].style.display = "block"

        const keyBind = function(keyboard) {            
            const keys = []
            keys[keyboard.keyCode] = true

            if (keys[17] && keys[113]) {
                preventEvent(keyboard)
                alert("보기")
            } else if (keyboard.key === "F5") {
                preventEvent(keyboard)
                window.location.reload()
            } else if (keyboard.key === "Delete") {
                preventEvent(keyboard)
                e.target.parentElement.children[8].style.display = "block"
                e.target.parentElement.children[6].style.display = "none"
            }
        }

        window.addEventListener("keydown", keyBind)

        window.onclick = () => {
            const hideAll = document.getElementsByClassName("contextMenu", keyBind)

            Array.from(hideAll).forEach((element) => {
                element.style.display = "none"
            })

            window.removeEventListener("keydown", keyBind)
        }
    }

    React.useEffect(() => {

        // setTimeout(() => {
        //     for (let i = 0; i < 3; i++) {
        //         console.log(i)
        //         const ctx = document.getElementById(`ctx${i + 1}`)

        //         ctx.onmouseover = (e) => {
        //             console.log('ff')
        //             e.target.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)"
        //         };

        //         ctx.onmouseout = (e) => {
        //             e.target.parentElement.style.backgroundColor = "none"
        //         }
        //     }
        // }, 1000)
    }, [])
    
    return (
        <span className="Post">
            <span className="postId postArea">{props.id}</span>
            <span className="postTitle postArea" onClick={(e) => {
                increaseViews_moveToPost(e)
            }} onContextMenu={contextMenu}>{props.title}</span>
            <span className="postIsAdmin postArea">{props.isAdmin}</span>
            <span className="postDate postArea">{props.date}</span>
            <span className="postAuthor postArea">{props.author}</span>
            <span className="postViews postArea">{props.views}</span>
            <div className="contextMenu" style={{display:"none"}} onContextMenu={(e) => {e.preventDefault()}}>
                <ul>
                    <li onClick={(e) => {ctxMenu_MoveToPost(e)}}>
                        <i className="fa-solid fa-eye"></i>
                        <span>보기</span>
                        <span className="hotkey">Ctrl + F2</span>
                    </li>

                    <li onClick={(e) => {showDelPopup(e)}}>
                        <i className="fa-solid fa-trash-can"></i>
                        <span>삭제</span>
                        <span className="hotkey">Delete</span>
                    </li>

                    <li onClick={(e) => {
                        window.location.href = `/edit?id=${e.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText}`
                    }}>
                        <i className="fa-solid fa-pen"></i>
                        <span>수정</span>
                        <span className="hotkey">Ctrl + F3</span>
                    </li>
                </ul>
            </div>
            <br/>
            <div className="popup-background">
                <div className="enter-password">
                    <h2>비밀번호를 입력하세요.</h2>
                    <input type="password" className="password-input" maxLength="16" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            delPost(e)
                        }
                    }}/>
                    <br/>
                    <button className="cancel-del" onClick={(e) => {hideDelPopup(e);}}>취소</button>
                    <button className="del-postboard" onClick={(e) => {delPost(e);}}>삭제</button>
                </div>
            </div>
        </span>
    )
}

export default Post;