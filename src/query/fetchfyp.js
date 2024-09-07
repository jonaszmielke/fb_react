import { token } from "../login/login";

const fetchFyp = async (omit) => {

    const response = await fetch(`http://localhost:3000/api/fyp_posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ omit }) 
    });

    if (!response.ok)
        throw new Error(`Fyp posts' ids fetch not ok, omit = ${omit}`);

    return response.json();
};

export default fetchFyp;
