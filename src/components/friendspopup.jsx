import React from 'react';

import './friendspopup.css';

function FriendsPopup(props) {



  return (props.trigger) ? (
    <div className='friends-popup'>
        <div className='popup-inner'>
            <p>friendsPopup</p>
            <button className='closeBtn' onClick={() => props.setTrigger(false)}></button>
        </div>
    </div>
  ) : ""
}

export default FriendsPopup;