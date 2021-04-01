import React, { useState } from 'react'
import './Banner.css'
import { Button } from "@material-ui/core";
import Search from './Search';
import { useHistory } from "react-router-dom";

function Banner() {
    const history = useHistory();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <>
            <div className='banner__search'>
                {showSearch && <Search />}

                <Button onClick={() => setShowSearch(!showSearch)} className='banner__searchButton' >
                    {showSearch ? "Hide" : "Search"}
                </Button>
            </div>
            <div className='banner' style={{background: `url("${process.env.REACT_APP_API_URL || (window.location.href.slice(0, -1) + ':8000')}/files/background.jpeg") no-repeat`}}>
                <div className='banner__info'>
                    <h1>Centralizing the motorcycle world</h1>
                    <h5>
                        Start a different kind of ride by uncovering the hidden gems near you.
                    </h5>
                    <Button onClick={() => history.push('/search')} variant='outlined'>Explore</Button>
                </div>
            </div>
       </>
    )
}

export default Banner
