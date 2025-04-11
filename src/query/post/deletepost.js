const deletePost = async ({ post_id, jwt }) => {

    const url = `http://localhost:3000/api/post/${post_id}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) return false;
    return true;
};

export default deletePost;
