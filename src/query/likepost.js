const likePost = async ({postid, isLiked, userjwt}) => {

    const url = `http://localhost:3000/api/like/${postid}`;

    const response = await fetch(url, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
            'Authorization': `Bearer ${userjwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) return false;

    return true;
};

export default likePost;