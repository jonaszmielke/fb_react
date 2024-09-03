const fetchjwt = async (email, password) => {
    const response = await fetch('http://localhost:3000/unauth/signin', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email': email, 'password': password})
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.error)
        return {
            error: true
        };
    }

    return {
        error: false,
        token: data.token
    };
}

export default fetchjwt;