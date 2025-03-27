const fetchComments = async ({ queryKey, jwt, page }) => {

    const postid = queryKey[1];
    const url = `http://localhost:3000/api/comment/${postid}?page=${page}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch comments of post ${postid}`);
    }

    const result = await response.json();

    return result;
};

export default fetchComments;
