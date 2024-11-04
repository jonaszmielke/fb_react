const fetchFriends = async (userid, jwt) => {

    let url = `http://localhost:3000/api/user/friends/${userid}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch friends");
    }

    const result = await response.json();

    return result;
};

export default fetchFriends;