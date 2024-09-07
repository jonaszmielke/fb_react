import { useQuery } from "@tanstack/react-query";
import fetchPost from "../query/fetchpost";
import "./post.css"

const date_options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};

const Post = ({ id }) => {
    
    const { data: postDetails, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: fetchPost
    });

    if (isLoading) {
        return (
            <div className="post">
                <p>Loading...</p>
            </div>
        );
    }

    if(!postDetails){
        return (
            <div className="post">
                <p>Error loading post {id}</p>
            </div>
        );
    }

    let date = new Date(postDetails.createdAt);
    date = date.toLocaleString('en-UK', date_options)
    return (
        <div className="post">
            <div className="postHeader">
                <div>
                    <img src={`http://localhost:3000/app_images/profile_pictures/${postDetails.owner.profilePictureUrl}`} alt="Author's profile piscture"/>
                    <span>{`${postDetails.owner.name} ${postDetails.owner.surname}`}</span>
                    <span>{date}</span>
                </div>
                <div>
                    <p>...</p>
                </div>
            </div>
            <div>
                {postDetails.text}
            </div>
            <img src={`http://localhost:3000/app_images/posts/${postDetails.imageUrl}`} alt="Post picture"/>
        </div>
    );
};

export default Post;
