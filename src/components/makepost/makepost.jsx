import React, { useState, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import styles from './makepost.module.css';
import { useQueryClient } from '@tanstack/react-query';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../imageUploader/cropImage';

function MakePostPopup({ trigger, setTrigger, user }) {
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [showCrop, setShowCrop] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);

    const fileInputRef = useRef();
    const queryClient = useQueryClient();

    // When a file is selected, load it and open crop modal
    const handleFileChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewSrc(reader.result);
            setShowCrop(true);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
    };

    // Capture cropped area dimensions
    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // Apply the crop to generate a blob and update preview
    const handleConfirmCrop = async () => {
        if (!croppedAreaPixels || !previewSrc) return;
        try {
            const blob = await getCroppedImg(previewSrc, croppedAreaPixels);
            setCroppedBlob(blob);
            setPreviewSrc(URL.createObjectURL(blob));
        } catch (err) {
            console.error('Crop failed:', err);
            alert('Failed to crop image');
        } finally {
            setShowCrop(false);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        }
    };

    // Submit post with text and (cropped) image
    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', text);
        const fileToUpload = croppedBlob || selectedFile;
        if (fileToUpload) {
            formData.append('image', fileToUpload, fileToUpload.name || 'image.png');
        }
        try {
            const jwt = Cookies.get('userjwt') || '';
            const res = await fetch('http://localhost:3000/api/post', {
                method: 'POST',
                headers: { Authorization: `Bearer ${jwt}` },
                body: formData,
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Status ${res.status}`);
            }
            const { message, postid } = await res.json();
            setText('');
            setSelectedFile(null);
            setPreviewSrc(null);
            setCroppedBlob(null);
            setShowCrop(false);
            setTrigger(false);
            queryClient.invalidateQueries(['fyp_posts']);
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
                    <button type="button" onClick={() => setTrigger(false)} className={styles.closeButton}>
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

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {/* Crop modal */}
                {showCrop && previewSrc && (
                    <div className={styles.cropModal}>
                        {/* Wrapper to contain cropper and prevent overlap */}
                        <div className={styles.cropContainer}>
                            <Cropper
                                image={previewSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className={styles.cropControls} style={{ position: 'relative', zIndex: 10, background: '#fff' }}>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={e => setZoom(e.target.value)}
                            />
                            <button type="button" onClick={handleConfirmCrop} className={styles.cropButton}>
                                Confirm Crop
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.postActions}>
                    <div className={styles.AddToPost}>
                        {previewSrc ? (
                            <img src={previewSrc} className={styles.previewThumb} alt="preview" />
                        ) : (
                            <p>Add to post</p>
                        )}
                        <button
                            className={styles.AddImageButton}
                            onClick={e => { e.preventDefault(); fileInputRef.current.click(); }}
                        >
                            <img src="../../icons/image.svg" alt="add" />
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
