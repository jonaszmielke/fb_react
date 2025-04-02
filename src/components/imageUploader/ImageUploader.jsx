import React, { useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import getCroppedImg from './cropImage'; // helper function to crop image

function ImageUploader({ aspect, trigger, setTrigger}) {
    const jwt = Cookies.get('userjwt');
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

    console.log(jwt);
      // Use jwt in headers if needed later:
      await axios.post('http://localhost:3000/api/user/profile_picture', formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      alert('Image uploaded successfully!');
    } catch (e) {
      console.error(e);
      alert('Upload failed.');
    }
  }, [imageSrc, croppedAreaPixels, jwt]);

  // Only render popup if trigger is true.
  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Upload and Crop Image</h3>
          <button onClick={() => setTrigger(false)}>X</button>
        </header>
        <div>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {imageSrc && (
            <div style={{ position: 'relative', width: '400px', height: '300px', marginTop: '20px' }}>
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
            <button onClick={uploadCroppedImage} style={{ marginTop: '20px' }}>
              Upload Cropped Image
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ImageUploader;
