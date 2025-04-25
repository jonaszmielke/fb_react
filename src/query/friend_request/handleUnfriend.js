const fetchUnfriend = async ({jwt, friend_id, friendship_id}) => {

    const response = await fetch(`http://localhost:3000/api/friends/unfriend?friend_id=${friend_id}&friendship_id=${friendship_id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to remove friendship friend_id: ${friend_id}, friendship_id: ${friendship_id}`);
    }

    return response;
}

export default fetchUnfriend;