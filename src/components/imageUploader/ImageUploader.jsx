import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import getCroppedImg from './cropImage'; // helper function to crop image

import './imageUploader.css';

function ImageUploader({ aspect, title, url, refresh=false, trigger, setTrigger}) {
    const jwt = Cookies.get('userjwt');
    const queryClient = useQueryClient();

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Handle file selection and convert the file to a data URL.
    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
        }
    };

    // Utility to read file as a data URL.
    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };

    // Callback when cropping is complete.
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Create the cropped image blob and upload it.
    const uploadCroppedImage = useCallback(async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append('image', croppedImageBlob, 'croppedImage.png');

            // Use jwt in headers if needed later:
            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (refresh) {
                let user = JSON.parse(Cookies.get('user'));
                queryClient.invalidateQueries(["userData", parseInt(user.id)]).then(() => {

                    const updatedUserData = queryClient.getQueryData(["userData", parseInt(user.id)]);
                    if (updatedUserData) {
                        user.backgroundUrl = updatedUserData.backgroundUrl;
                        Cookies.set('user', JSON.stringify(jwt.user), { sameSite: 'Strict' });
                    }
                });
            }
            alert('Image uploaded successfully!');

        } catch (e) {

            console.error(e);
            alert('Upload failed.');
        }
    }, [imageSrc, croppedAreaPixels, jwt]);

    // Only render popup if trigger is true.
    return trigger ? (
        <div className="popup">
            <div className={`image-popup-inner ${imageSrc ? 'expanded' : ''}`}>
                <div className="popup-header">
                    <div></div>
                    <div className="popup-header-text">
                        <h1 className='image-popup-h1'>{title}</h1>
                    </div>
                    <div className="popup-header-close">
                        <button onClick={() => setTrigger(false)}>X</button>
                    </div>
                </div>
                <div style={{height: '100%'}}>
                    <div className='center-the-button choose-file-button-div'>
                        <input type="file" accept="image/*" onChange={onFileChange} id="choose-file-button" style={{ display: 'none' }} />
                        <label htmlFor="choose-file-button" className="choose-file-label grey">
                            {imageSrc ? "Change Image" : "Select Image"}
                        </label>
                    </div>
                    {imageSrc && (
                        <div className='image-crop-section'>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect} // Use the aspect ratio provided via props.
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    )}
                    {imageSrc && (
                        <div className='center-the-button'>
                            <button onClick={uploadCroppedImage} className='image-confirm-button blue'>
                                Upload Cropped Image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : ( "" );
}

export default ImageUploader;
