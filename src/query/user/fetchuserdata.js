const fetchUserData = async ({queryKey, userjwt}) => {

    const userid = queryKey[1];
    const url = `http://localhost:3000/api/user/data/${userid}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userjwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch friends list");
    }

    const result = await response.json();

    return result;
};

export default fetchUserData;