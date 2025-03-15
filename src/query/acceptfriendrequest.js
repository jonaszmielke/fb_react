const acceptFriendRequest = async ({ jwt, friendRequestId }) => {
    const response = await fetch(`http://localhost:3000/api/friends/accept/?friendrequestid=${friendRequestId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to accept friendrequest ${friendRequestId}`);
    }

    return response;
}

export default acceptFriendRequest;