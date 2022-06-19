import React, { useState, useEffect } from "react";
import "../css/PagiNation.css"

function PagiNation(props) {

    // window.console.log(`${props.postsPerPage} / ${props.totalPages}`)

    const pageClickEvent = (page) => {
        props.setCurrentPage(page)
    }

    const pageList = props.pageArray.map(
        (page) => (<span className="pagenumber" onClick={() => {pageClickEvent(page)}} key={page}>{page}</span>)
    )

    return (
        <div id="PagiNation">
            {pageList}
        </div>
    )
}

export default PagiNation