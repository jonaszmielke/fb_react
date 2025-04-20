function MakePostPopup({trigger, setTrigger, user}) {
  return makePostVisible ? (

    <div className='popup'>
        <form className='popup-inner'>

            <div className="make-post-header">
                <h1>Create a post</h1>
                <button onClick={() => {setMakePostVisible(false)}}>X</button>
            </div>
            <div className="make-post-user">
                <img src={`http://localhost:3000/app_images/profile_pictures/${userData.profile_picture_url}`} />
                <p>{user.name} {user.surname}</p>
            </div>
            <textarea placeholder={`What are you thinking about, ${user.name}`}></textarea>
            <div>Add to post</div>
            <button type="submit">Submit</button>
        </form>
    </div>
  ) : '';
}

export default MakePostPopup