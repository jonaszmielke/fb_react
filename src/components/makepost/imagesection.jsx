import styles from './makepost.module.css'

function ImageSection() {
    return (
        <div className={styles.AddToPost}>
            <p>Add to post</p>
            <button className={styles.AddImageButton} onClick={(e) => {
                e.preventDefault()
                alert('you clicked me!')
            }}>
                <img src='../../icons/image.svg' />
            </button>
        </div>
    )
}

export default ImageSection