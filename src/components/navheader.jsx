import { Query, QueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const NavHeader = () => {
    return(
        <header>
            <div>
                <input type="text" id="searchbar" placeholder="Search on fb app"/>
            </div>
            <nav>
                <img src="http://localhost:3000/app_images/site/home.svg" alt="home"/>
                <img src="http://localhost:3000/app_images/site/friend_requests.svg" alt="friend requests"/>

                <Link to={"/home"}><h1>fb app</h1></Link>
            </nav>
            <div>
                aaa
            </div>
        </header>
    );
}

export default NavHeader;