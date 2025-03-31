import { useState } from "react";
import Cookies from "js-cookie";
import '../../components/popup.css';
import './editprofile.css';

const EditProfileButton = () => {

    const [showEditProfile, setShowEditProfile] = useState(false);
    const jwt = Cookies.get('jwt');

    return(
        <>
            <button className="friendship_button grey" onClick={() => {setShowEditProfile(true)}}>
                <img
                    src="http://localhost:3000/app_images/site/pencil.svg"
                    alt="Add Friend"
                    className="add_friend_icon"
                />
                Edit Profile
            </button>

            <EditProfilePopup
                trigger={showEditProfile}
                setTrigger={setShowEditProfile}
                jwt={jwt}
            />
        </>
    );
};


const EditProfilePopup = ({trigger, setTrigger, jwt}) => {

    const user = JSON.parse(Cookies.get('user'));

    return trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="edit_profile_header">
                    <div></div>
                    <div className="edit_profile_header_text">
                        <h1>Edit profile</h1>
                    </div>
                    <div className="edit_profile_header_close">
                        <button onClick={() => setTrigger(false)}>X</button>
                    </div>
                </div>
                <section>
                    <div className="section_header">
                        <h2>Profile picture</h2>
                        <p>Edit</p>
                    </div>
                    <div className="content">
                        <img className="edit_profile_profile_picture" src={`http://localhost:3000/app_images/profile_pictures/${user.profilePictureUrl}`}/>
                    </div>
                </section>
                <section>
                    <div className="section_header">
                        <h2>Background</h2>
                        <p>Edit</p>
                    </div>
                    <div className="content">
                        <img className="edit_profile_background" src={`http://localhost:3000/app_images/profile_pictures/${user.backgroundUrl}`}/>
                    </div>
                </section>
            </div>
        </div>
    ) : "";
};


export default EditProfileButton;