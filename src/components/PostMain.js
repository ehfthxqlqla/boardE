import React, { useEffect, useState } from "react";
import queryString from 'query-string'
import "../css/PostMain.css"
import PostList from "./PostList.js";
import PagiNation from "./Pagination.js";
import axios from "axios";

function PostMain() {

    const [content, setContent] = useState([ // 17
        {password:"Admindolsot!", id:"-1", title:"음.. 아무것도 없네요", contents:"SQL 서버가 마비된것 같습니다.", isAdmin:"없음", postDate:"0000-00-00", author:"SERVER", views:-1}
    ])
    const [postInformation, setPostInformation] = useState([
        {id:"번호", title:"제목", contents:"내용", isAdministrator:"관리자", date:"작성일지", author:"작성자", views:"조회수"}
    ])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(12) // 한페이지당 12개의 게시물

    const indexOfLast = currentPage * postsPerPage
    const indexOfFirst = indexOfLast - postsPerPage

    let currentShowPosts;

    const currentPosts = (params) => {
        currentShowPosts = params.slice(indexOfFirst, indexOfLast);
        return currentShowPosts;
    }

    const pageNumber = Math.ceil(content.length / postsPerPage)

    let pagiNationArray = [];

    // useEffect(async() => {
    //     setContent(await axios.get(`/api/get/boardinfo`).data.)
    // })

    for (let i = 1; i <= pageNumber; i++) {
        pagiNationArray.push(i)
    }

    // let arrow = "down"

    // const paginationSelectbox = () => {
    //     const fontawesome = document.getElementsByClassName("selectbox-arrow")[0],
    //     selectbox = document.getElementsByClassName("select")[0],
    //     box = document.getElementsByClassName("selectbox")[0],
    //     placeholder = document.getElementById("select-placeholder")

    //     if (arrow === "down") {
    //         fontawesome.classList.remove("fa-angle-down")
    //         fontawesome.classList.add("fa-angle-up")
    //         selectbox.style.display = "block"
    //         box.style.minHeight = "160px"
    //         placeholder.style.top = "70%"
    //         console.log(box)
    //         arrow = "up"
    //     } else if (arrow === "up") {
    //         fontawesome.classList.remove("fa-angle-up")
    //         fontawesome.classList.add("fa-angle-down")
    //         selectbox.style.display = "none"
    //         box.style.minHeight = "40px"
    //         placeholder.style.top = "80%"
    //         arrow = "down"
    //     }
    // }

    function escKeyClose(e) {
        if (e.key === "Escape") {
            const bg = document.getElementsByClassName("search-background")
            bg[0].style.display = "none"
        }
    }

    const showSearch = (e) => {
        const realTarget = e.target.parentElement.parentElement.children[5]
        realTarget.style.display = "block"
        document.getElementsByClassName("search-content")[0].focus()
        window.addEventListener("keydown", escKeyClose)
    }

    const hideSearch = (e) => {
        const realTarget = e.target.parentElement.parentElement.parentElement.parentElement
        realTarget.style.display = "none"
        document.getElementsByClassName("search-content")[0].focus()
        window.removeEventListener("keydown", escKeyClose)
    }

    useEffect(() => {
        const getMySQL = async() => {
            if (!window.location.search) {
                const res = await axios.get(`/api/get/boardinfo`)
                setContent(Array.from(res.data.board).sort((a, b) => {
                    return b.id - a.id
                }))
            } else {
                const search = queryString.parse(window.location.search),
                res = await axios.get(`/api/get/boardinfo_search/${search.search}`).catch(() => {
                    setContent([
                        {password:"Admindolsot!", id:"-404", title:"검색결과가 없습니다.", contents:"검색결과 없음", isAdmin:"없음", postDate:"404", author:"SERVER", views:-404}
                    ])
                    return
                })
                
                if (res !== undefined) {
                    setContent(res.data.board)
                } else {
                    setContent([
                        {password:"Admindolsot!", id:"-404", title:"검색결과가 없습니다.", contents:"검색결과 없음", isAdmin:"없음", postDate:"404", author:"SERVER", views:-404}
                    ])
                }
            }
            return
        }
        getMySQL()
    }, [])

    return (
        <div id="PostMain">
            <PostList postInformationJsonContent={postInformation} jsonContent={currentPosts(content)}/>
            <PagiNation postsPerPage={postsPerPage} totalPages={content.length} currentPage={1} pageArray={pagiNationArray} setCurrentPage={setCurrentPage}/>
            <h1 id="board-h2">게&nbsp;&nbsp;시&nbsp;&nbsp;판&nbsp;&nbsp;( 자유 )</h1>
            <a className="write-board" href="/write" style={{textDecoration:"none", color:"#000000"}}>
                <i className="fa-solid fa-pen fa-spin"></i>
                <span>글쓰기</span>
            </a>
            <div className="search-board" onClick={(e) => {showSearch(e)}}>
                <i className="fa-solid fa-search"></i>
                <span>검색</span>
            </div>
            <div className="search-background">
                <div className="search-background-fill">
                    <div className="search-area">
                        <h2>검색하기</h2>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요."
                            className="search-content"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    document.cookie = `searchQueryOfBoard_nosearch=${e.target.value}`
                                    window.location.href = `/?search=${document.cookie.replace("searchQueryOfBoard_nosearch=", "")}`
                                }
                            }}
                        />
                        <div className="button-space-between">
                            <button className="cancel-search" onClick={(e) => {hideSearch(e)}}>취소</button>
                            <button className="do-search">검색</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="pagination-amount">
                <div className="selectbox">
                    <ul className="select">
                        <li onClick={() => {setPostsPerPage(12)}}>기본 (12개)</li>
                        <li onClick={() => {setPostsPerPage(20)}}>20개</li>
                        <li onClick={() => {setPostsPerPage(30)}}>30개</li>
                        <li onClick={() => {setPostsPerPage(40)}}>40개</li>
                    </ul>
                    <span id="select-placeholder" onClick={() => {paginationSelectbox()}}>게시물 갯수 <i className="fa-solid fa-angle-down selectbox-arrow"></i></span>
                </div>
            </div> */}
        </div>
    )
}

export default PostMain;