import { useParams } from "react-router-dom"

const User = () => {

    const { id } = useParams();

    return(
        <h1>id = {id}</h1>
    );

}

export default User;