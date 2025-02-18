import React from 'react'
import Cookies from 'js-cookie';

import '../popup.css';
import './commentspopup.css';

function CommentsPopup({ trigger, setTrigger, postid }) {
    const userjwt = Cookies.get('userjwt');


    return (trigger) ? (
  
        <div className='popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' onClick={() => setTrigger(false)}>X</button>
                </div>
                <div className='content-section'>
                    <p>Comments {postid}</p>
                </div>
            </div>
        </div>

    ) : "";
}

export default CommentsPopup