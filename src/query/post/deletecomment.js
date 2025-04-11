const deleteComment = async ({ comment_id, jwt }) => {

    const url = `http://localhost:3000/api/comment/${comment_id}`;

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

export default deleteComment;
