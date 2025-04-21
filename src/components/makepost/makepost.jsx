import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import styles from './makepost.module.css';


function MakePostPopup({ trigger, setTrigger, user }) {
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const fileInputRef = useRef();

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => setPreviewSrc(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // build the FormData payload
        const formData = new FormData();
        formData.append('text', text);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            const jwt = Cookies.get('userjwt') || '';
            const res = await fetch('http://localhost:3000/api/post', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Status ${res.status}`);
            }

            const { message, postid } = await res.json();
            console.log(message, 'new post id:', postid);

            // reset & close
            setText('');
            setSelectedFile(null);
            setPreviewSrc(null);
            setTrigger(false);

        } catch (err) {
            console.error('Post upload failed:', err);
            alert(`Upload failed: ${err.message}`);
        }
    };


    if (!(trigger && user)) return null;

    return (
        <div className="popup">
            <form className={styles.popupInner} onSubmit={handleSubmit}>
                <div className={styles.makePostHeader}>
                    <h1>Create a post</h1>
                    <button
                        type="button"
                        onClick={() => setTrigger(false)}
                        className={styles.closeButton}
                    >
                        X
                    </button>
                </div>

                <div className={styles.makePostUser}>
                    <img
                        className="headerProfilePicture"
                        src={`http://localhost:3000/app_images/profile_pictures/${user.profile_picture_url}`}
                        alt="you"
                    />
                    <p>{user.name} {user.surname}</p>
                </div>

                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={`What are you thinking about, ${user.name}?`}
                    className={styles.textarea}
                />

                {/* hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <div className={styles.postActions}>
                    <div className={styles.AddToPost}>
                        {previewSrc
                            ? <img src={previewSrc} className={styles.previewThumb} alt="preview" />
                            : <p>Add to post</p>
                        }
                        <button
                            className={styles.AddImageButton}
                            onClick={e => {
                                e.preventDefault();
                                fileInputRef.current.click();
                            }}
                        >
                            <img src='../../icons/image.svg' alt="add" />
                        </button>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MakePostPopup;
