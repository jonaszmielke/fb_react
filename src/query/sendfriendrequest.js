const sendFriendRequest = async ({ receiverid, jwt }) => {

    const response = await fetch(`http://localhost:3000/api/friends/invite/?receiverid=${receiverid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to invite user ${userid}`);
    }

    return response;
}

export default sendFriendRequest;