import React from 'react';
import './Footer.css'

function Footer() {
    return (
        <div className='footer'>
            <p>© 2021 MotoHUB! No rights reserved</p>
            <div>
                <a href='/privacy'>Privacy </a><p> · </p><a href='/help'> Help</a>
            </div>
        </div>
    )
}

export default Footer
