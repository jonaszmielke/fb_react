const fetchFriendRequests = async ({ jwt, page }) => {

    const url = `http://localhost:3000/api/friends/`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch friendrequests`);
    }

    const result = await response.json();

    return result;
};

export default fetchFriendRequests;