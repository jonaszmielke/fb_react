const sendFriendRequest = async ({ receiverid, jwt }) => {

    const response = await fetch(`http://localhost:3000/api/friends/invite/?receiverid=${receiverid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to invite user ${receiverid}`);
    }

    return { ok: response.ok, friendRequestId: data.friendRequestId };
}

export default sendFriendRequest;