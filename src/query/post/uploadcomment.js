const uploadComment = async ({postid, text, userjwt}) => {
    const url = `http://localhost:3000/api/comment/${postid}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userjwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text }) // Use "text" as the property name
    });

    if (!response.ok) return false;

    return true;
};

export default uploadComment;