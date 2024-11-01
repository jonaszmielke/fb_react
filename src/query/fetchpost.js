const fetchPost = async ({ queryKey, userjwt }) => {

    const postId = queryKey[1];
    const response = await fetch(`http://localhost:3000/api/post/${postId}`, {
        headers: {'Authorization': `Bearer ${userjwt}`}
    });

    if (!response.ok)
        throw new Error(`Post fetch not ok, id = ${postId}`);

    return response.json();
};

export default fetchPost;
