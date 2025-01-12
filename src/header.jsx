import { Query, QueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Header = () => {
    return(
        <header>
            <div>
                <input type="text" id="searchbar" placeholder="Search on fb app"/>
            </div>
            <div>
                <Link to={"/home"}><h1>fb app</h1></Link>
            </div>
            <div>
                aaa
            </div>
        </header>
    );
}

export default Header;