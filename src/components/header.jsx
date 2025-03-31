import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({selected}) => {

    const user = JSON.parse(Cookies.get('user'));
    const navigate = useNavigate();

    return(
        <header>
            <div>
                <input type="text" id="searchbar" placeholder="Search on fb app"/>
            </div>
            <nav>
                <Link to={"/home/fyp"}>
                    <img src={`http://localhost:3000/app_images/site/home${selected === 1 ? "_selected" : ""}.svg`} alt="home" className="navimg"/>
                </Link>

                <Link to={"/home/friend_requests"}>
                    <img src={`http://localhost:3000/app_images/site/friend_requests${selected === 2 ? "_selected" : ""}.svg`} alt="friend requests" className="navimg"/>
                </Link>
            </nav>
            <div>
                <img 
                    className="headerProfilePicture" 
                    src={`http://localhost:3000/app_images/profile_pictures/${user.profilePictureUrl}`} 
                    alt="your profile picture"
                    onClick={() => {
                        navigate(`/user/${user.id}`);
                    }}    
                />

            </div>
        </header>
    );
}

export default Header;