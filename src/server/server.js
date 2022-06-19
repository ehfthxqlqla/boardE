const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 4000
const db = require("./config/db.js")

app.use(bodyParser.json())

app.get(`/api/get/boardinfo`, (req, res) => {
    
    db.query("select * from boards;", (error, data) => {
        if (!error) {
            res.send({board:data})
        } else {
            console.log(error)
        }
    })
})

app.get(`/api/get/boardinfo_search/:search`, (req, res) => {
    db.query(`select * from boards where title like "%${req.params.search}%"`, (error, data) => {
        if (!error) {
            res.send({board:data})
        } else {
            console.log(error)
        }
    })
})

app.get(`/api/v1/boards_info`, (req, res) => {
    db.query(`select * from boards;`, (error, data) => {
        if (!error) {
            let boardData = [];
            data.forEach((element) => {
                delete element.postPassword
                boardData.push(element)
            })
            res.send(boardData)
        } else {
            console.log(error)
            res.send(`Request Failed :\n\n${error}`)
        }
    })
})

app.get(`/api/get/boardWithId/:boardId`, (req, res) => {
    db.query(`select * from boards where id=${req.params.boardId};`, (error, data) => {
        if (!error) {
            res.send({extract:data})
        } else {
            // console.log(error)
            console.log("에러")
        }
    })
})

app.post(`/api/post/boardpost`, (req, res) => {

    // console.log(req.body)

    db.query(

        `insert into boards values("${req.body.password}", ${req.body.id}, "${req.body.title}", "${req.body.contents}", "${req.body.isAdmin}", "${req.body.postDate}", "${req.body.author}", ${req.body.views});`,

        (error) => {
            if (!error) {

                db.query(
                    `create table board_comment_${req.body.id}(id int, author varchar(25), commentPW varchar(16), contents varchar(300), commentDate varchar(10))`,
                    (err) => {
                        if (!err) {
                            res.send(true)
                        } else {
                            console.log(err)
                            res.send(false)
                        }
                    }
                )

            } else {
                res.send(false)
                console.log(error)
            }
        }
    )
})

// create table board_comment_5(id int, author varchar(25), commentPW varchar(16), contents varchar(300), commentDate varchar(10))

app.delete(`/api/delete/boardDel`, (req, res) => {

    console.log(req.body.delId)

    db.query(`delete from boards where id=${req.body.delId};`, (error) => {
        if (!error) {
            db.query(`drop table board_comment_${req.body.delId}`, (err) => {
                if (!err) {
                    res.send(true)
                } else {
                    console.log(err)
                    res.send(false)
                }
            })
        } else {
            res.send(false)
        }
    })
})

app.patch(`/api/patch/viewUpdate/:id`, (req, res) => {

    const id = parseInt(req.params.id)

    db.query(`select views from boards where id=${id}`, (error, data) => {
        if (!error) {
            db.query(
                `update boards set views=${parseInt(data[0].views) + 1} where id=${req.params.id}`,
                (err) => {
                    if (!err) {
                        res.send(false)
                    }
                }
            )
        } else {
            console.log(error)
            res.send(false)
        }
    })

    // const viewPlus = parseInt(req.params.views)

    // db.query(`update boards set views=${viewPlus + 1} where id=${req.params.id}`, (error) => {
    //     if (!error) {
    //         res.send(true)
    //     } else {
    //         res.send(false)
    //     }
    // })
})

app.post(`/api/post/editBoard`, (req, res) => {
    const edit = req.body
    const id = edit.id

    db.query(`update boards set title="${edit.title}", contents="${edit.content}" where id=${id}`, (error) => {
        if (!error) {
            res.send(true)
        } else {
            res.send(false)
            console.log(error);
        }
    })
})

/* ---------------- 댓글 서버 ---------------- */

app.get(`/api/get/getComments/:id`, (req, res) => {
    const id = req.params.id

    db.query(`select * from board_comment_${id}`, (error, data) => {
        if (!error) {
            res.send({data:data})
        } else {
            console.log(error)
        }
    })
})

app.post(`/api/post/writeComment`, (req, res) => {
    console.log(`update comment`);
    const info = req.body,
    id = info.id,
    boardId = info.webid

    console.log(info)

    // id 저자 비번 내용 날짜

    db.query(
        `insert into board_comment_${boardId} values(${id}, "${info.author}", "${info.password}", "${info.contents}", "${info.commentDate}")`,
        (error) => {
            if (!error) {
                res.send(true)
            } else {
                console.log(error)
                res.send(false)
            }
        }
    )
})

console.log(PORT)

app.listen(PORT, () => {
    console.log(`Server is online at : http://localhost:${PORT}`)
})