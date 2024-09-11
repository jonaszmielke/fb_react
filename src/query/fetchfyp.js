import { token } from "../login/login";

const fetchFyp = async (omit) => {

    let url = 'http://localhost:3000/api/fyp_posts';

    if(omit)
        url += `?${new URLSearchParams({ omit: JSON.stringify(omit) }).toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error(`Fyp posts' ids fetch not ok, omit = ${omit}`);

    const data = await response.json();

    if(data.allPostsDepleted)
        return {'allPostsDepleted': true};

    return {
        'postids': data.postids,
        'allPostsDepleted': false
    };
};

export default fetchFyp;
