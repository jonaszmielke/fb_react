import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from '@tanstack/react-query';

import './signup.css'
import { motion, AnimatePresence } from 'framer-motion';

import ImageUploader from '../../components/imageUploader/ImageUploader';
import fetchUserData from '../../query/user/fetchuserdata';

const UserDataForm = ({ setStep }) => {

    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [email, setEmail] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);


    const submitForm = async () => {

        const wrong_data = document.getElementById('wrong-data');
        if (password1 !== password2) {
            wrong_data.style.display = 'block';
            wrong_data.innerText = 'passwords are not identical';
        } else {
            const request = await fetch('http://localhost:3000/unauth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    email: email,
                    password: password1,
                }),
            });

            const result = await request.json();
            if (request.ok) {

                Cookies.set('userjwt', result.token, { sameSite: 'Strict', secure: true });
                Cookies.set('user', JSON.stringify(result.user), { sameSite: 'Strict' });
                setStep(2);

            } else {

                wrong_data.style.display = 'block';
                wrong_data.innerText = request.error;
            }
        }
    }


    return (

        <form className='signup-form' onSubmit={(e) => {
            e.preventDefault();
            submitForm();
        }}>

            <h1 className='signup-h1'>Sign up</h1>

            <label className='signup-label' htmlFor='name'>Name</label>
            <input
                className='signup-input'
                type='text'
                id='name'
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <label className='signup-label' htmlFor='surname'>Surname</label>
            <input
                className='signup-input'
                type='text'
                id='surname'
                value={surname || ''}
                onChange={(e) => setSurname(e.target.value)}
                required
            />

            <label className='signup-label' htmlFor='email'>Email</label>
            <input
                className='signup-input'
                type='email'
                id='email'
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label className='signup-label' htmlFor='password1'>Password</label>
            <input
                className='signup-input'
                type='password'
                id='password1'
                value={password1 || ''}
                onChange={(e) => setPassword1(e.target.value)}
                required
            />

            <label className='signup-label' htmlFor='password2'>Confirm Password</label>
            <input
                className='signup-input confirm-password'
                type='password'
                id='password2'
                value={password2 || ''}
                onChange={(e) => setPassword2(e.target.value)}
                required
            />
            <p className='wrong-data' id='wrong-data'></p>
            <button type='submit' className='signup-button'>Create account</button>
        </form>
    )
}




const ImagesForm = ({ setStep }) => {

    const [showProfilePhotoUpload, setShowProfilePhotoUpload] = useState(false)
    const [showBackgroundUpload, setShowBackgroundUpload] = useState(false)

    const user = JSON.parse(Cookies.get('user'));
    let userjwt = Cookies.get('userjwt')
    const queryClient = useQueryClient();

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ["userData", parseInt(user.id)],
        queryFn: ({ queryKey }) => {
            return fetchUserData({ queryKey, userjwt });
        }
    });

    useEffect(() => {
        queryClient.invalidateQueries(["userData", parseInt(user.id)]);
    }, [showProfilePhotoUpload, setShowBackgroundUpload]);


    if (!isLoading)
        console.log(userData)

    return (

        <div className='images-form'>

            <section>
                <div className="section_header">
                    <h2>Profile picture</h2>
                    <p onClick={() => { setShowProfilePhotoUpload(true) }}>Edit</p>
                </div>
                <div className="content">
                    <img className="edit_profile_profile_picture" src={`http://localhost:3000/app_images/profile_pictures/${isLoading || isError ? 'default.jpg' : userData.profile_picture_url}`} />
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
                    <p onClick={() => { setShowBackgroundUpload(true) }}>Edit</p>
                </div>
                <div className="content">
                    <img className="edit_profile_background" src={`http://localhost:3000/app_images/backgrounds/${isLoading || isError ? 'default.jpg' : userData.backgroundUrl}`} />
                </div>

                <ImageUploader
                    aspect={16 / 10}
                    title={'Change the background'}
                    url={'http://localhost:3000/api/user/background'}
                    refresh={true}
                    trigger={showBackgroundUpload}
                    setTrigger={setShowBackgroundUpload}
                />

            </section>
            <button onClick={() => { setStep(3) }} className='signup-button'>Done</button>
        </div>
    )
}


const AllSetWindow = () => {

    const navigate = useNavigate();

    return (
        <div className='all-set-window'>
            <h1>You're all set</h1>
            <p>Happy doomscrolling!</p>
            <button onClick={() => { navigate('/home/fyp')}} className='signup-button'>Continue</button>
        </div>
    )
}


function SignUpPage() {

    //framer animation logic
    const [step, setStep] = useState(1)
    const slideVariants = {
        enter: { x: '300%' },   // off‑screen to the right
        center: { x: 0 },        // in‑place
        exit: { x: '-300%' }   // off‑screen to the left
    }





    return (
        <div className='signup-page'>

            <AnimatePresence initial={false} exitBeforeEnter>

                {step === 1 && (
                    <motion.div
                        key='signup-form'
                        className='form-wrapper'
                        variants={slideVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{ duration: 0.5 }}
                    >

                        <UserDataForm
                            setStep={setStep}
                        />

                    </motion.div>
                )}


                {step === 2 && (
                    <motion.div
                        key='images-form'
                        className='form-wrapper'
                        variants={slideVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{ duration: 0.5 }}
                    >

                        <ImagesForm
                            setStep={setStep}
                        />

                    </motion.div>
                )}


                {step === 3 && (
                    <motion.div
                        key='all-set-window'
                        className='form-wrapper'
                        variants={slideVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{ duration: 0.5 }}
                    >

                        <AllSetWindow />

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}

export default SignUpPage