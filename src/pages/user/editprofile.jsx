import { useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import '../../components/popup.css';
import './editprofile.css';

import fetchUserData from "../../query/user/fetchuserdata";
import ImageUploader from "../../components/imageUploader/ImageUploader";

const EditProfileButton = () => {

    const [showEditProfile, setShowEditProfile] = useState(false);
    const jwt = Cookies.get('userjwt');

    return(
        <>
            <button className="friendship_button grey" onClick={() => {setShowEditProfile(true)}}>
                <img
                    src="../../icons/pencil.svg"
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
    const userjwt = Cookies.get('userjwt');

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ["userData", parseInt(user.id)],
        queryFn: ({ queryKey }) => {
            return fetchUserData({ queryKey, userjwt });
        }
    });

    const [showProfilePhotoUpload, setShowProfilePhotoUpload] = useState(false);
    const [showBackgroundUpload, setShowBackgroundUpload] = useState(false);

    return trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <div></div>
                    <div className="popup-header-text">
                        <h1>Edit profile</h1>
                    </div>
                    <div className="popup-header-close">
                        <button onClick={() => setTrigger(false)}>X</button>
                    </div>
                </div>
                <section>
                    <div className="section_header">
                        <h2>Profile picture</h2>
                        <p onClick={() => {setShowProfilePhotoUpload(true)}}>Edit</p>
                    </div>
                    <div className="content">
                        <img className="edit_profile_profile_picture" src={`http://localhost:3000/app_images/profile_pictures/${isLoading || isError ? 'default.jpg' : userData.profile_picture_url}`}/>
                    </div>

                    <ImageUploader 
                        aspect={1}
                        title={'Change profile picture'}
                        url={'http://localhost:3000/api/user/profile_picture'}
                        refresh={true}
                        trigger={showProfilePhotoUpload}
                        setTrigger={setShowProfilePhotoUpload}
                    />

                </section>
                <section>
                    <div className="section_header">
                        <h2>Background</h2>
                        <p onClick={() => {setShowBackgroundUpload(true)}}>Edit</p>
                    </div>
                    <div className="content">
                        <img className="edit_profile_background" src={`http://localhost:3000/app_images/backgrounds/${isLoading || isError ? 'default.jpg' : userData.backgroundUrl}`}/>
                    </div>

                    <ImageUploader 
                        aspect={16/10}
                        title={'Change the background'}
                        url={'http://localhost:3000/api/user/background'}
                        refresh={true}
                        trigger={showBackgroundUpload}
                        setTrigger={setShowBackgroundUpload}
                    />

                </section>
            </div>
        </div>
    ) : "";
};


export default EditProfileButton;