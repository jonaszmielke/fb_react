const fetchFriendRequests = async ({ jwt, page }) => {

    const url = `http://localhost:3000/api/friends/?page=${page}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch friendrequests`);
    }

    const result = await response.json();

    return result;
};

export default fetchFriendRequests;