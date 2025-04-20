import styles from './makepost.module.css'

function MakePostPopup({ trigger, setTrigger, user }) {
    return trigger || user ? (

        <div className='popup'>
            <form className={styles.popupInner}>
                <div className={styles.makePostHeader}>
                    <h1>Create a post</h1>
                    <button onClick={() => { setTrigger(false) }}>X</button>
                </div>
                <div className={styles.makePostUser}>
                    <img
                        className="headerProfilePicture"
                        src={`http://localhost:3000/app_images/profile_pictures/${user.profile_picture_url}`}
                    />
                    <p>{user.name} {user.surname}</p>
                </div>
                <textarea placeholder={`What are you thinking about, ${user.name}`}></textarea>
                <div className={styles.postActions}>
                    <div>Add to post</div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    ) : '';
}

export default MakePostPopup