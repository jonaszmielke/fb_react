const fetchUserData = async ({ queryKey, includeMutualFriends, jwt }) => {

    const userid = queryKey[1];
    const url = `http://localhost:3000/api/user/${userid}?includeMutualFriends=${includeMutualFriends ? "true" : "false"}`;

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

export default fetchUserData;
