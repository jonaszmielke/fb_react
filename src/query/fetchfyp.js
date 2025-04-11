const fetchFyp = async (page, jwt) => {

    let url = `http://localhost:3000/api/fyp_posts?page=${page}`;
    console.log(`Sending fyp request\njwt ${jwt}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) throw new Error("Fyp posts' ids fetch not ok");

    const result = await response.json();
    return result;
};

export default fetchFyp;
