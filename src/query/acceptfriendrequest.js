const handleFriendRequest = async ({ action, friendRequestId, jwt }) => {

    if (action != 'accept' && action != 'reject') {
        throw new Error('Invalid action');
    }

    const response = await fetch(`http://localhost:3000/api/friends/${action}/?friendrequestid=${friendRequestId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to ${action} friendrequest ${friendRequestId}`);
    }

    return response;
}

export default handleFriendRequest;