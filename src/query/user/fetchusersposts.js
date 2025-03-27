const fetchUsersPosts = async ({ queryKey, jwt, page }) => {

    const userid = queryKey[1];
    const url = `http://localhost:3000/api/user/posts/list/${userid}?page=${page}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch friends list");
    }

    const result = await response.json();

    return result;
};

export default fetchUsersPosts;
