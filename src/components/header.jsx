import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import fetchUserData from '../query/user/fetchuserdata';
import { useState } from "react";

const Header = ({selected}) => {

    const user = JSON.parse(Cookies.get('user'));
    const userjwt = Cookies.get('userjwt');

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ["userData", parseInt(user.id)],
        queryFn: ({ queryKey }) => {
            return fetchUserData({ queryKey, userjwt });
        }
    });

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('')

    return(
        <header>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    navigate(`/home/search?query=${encodeURIComponent(searchQuery)}`);
                }}>
                    <input value={searchQuery} onChange={ (e) => setSearchQuery(e.target.value) } type="text" id="searchbar" placeholder="Search on fb app"/>
                </form>
            </div>
            <nav>
                <Link to={"/home/fyp"}>
                    <img src={`../icons/home${selected === 1 ? "_selected" : ""}.svg`} alt="home" className="navimg"/>
                </Link>

                <Link to={"/home/friend_requests"}>
                    <img src={`../icons/friend_requests${selected === 2 ? "_selected" : ""}.svg`} alt="friend requests" className="navimg"/>
                </Link>
            </nav>
            <div>
                <img 
                    className="headerProfilePicture" 
                    src={`http://localhost:3000/app_images/profile_pictures/${isLoading || isError ? 'default.jpg' : userData.profile_picture_url}`} 
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