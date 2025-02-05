const fetchUsersPosts = async (userid, userjwt, omit) => {

    let url = `http://localhost:3000/api/user/posts/${userid}`;

    if(omit)
        url += `?${new URLSearchParams({ omit: JSON.stringify(omit) }).toString()}`;
    //console.log(url);


    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userjwt}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error(`User ${userid}'s ids fetch not ok, omit = ${omit}`);

    const data = await response.json();

    if(data.allPostsDepleted)
        return {'allPostsDepleted': true};

    //console.log("fetchUsersPosts data:", data);
    return {
        'postids': data.postids,
        'allPostsDepleted': false
    };
};

export default fetchUsersPosts;
