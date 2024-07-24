import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './Navigation.css'; 

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [hasToken, setHasToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setHasToken(true);
        }
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const login = () => {
        navigate("/login");
    };
    const ddd = () => {
        navigate("/drug");
    };

    const register = () => {
        navigate("/register");
    };

   
    const showLogout = location.pathname !== '/login';

    return (
        <div className="navigation-container">
            <ToastContainer />
            <div className="navigation-buttons">
                {isLoading ? (
                    <button className="loading-button" disabled>Loading...</button>
                ) : (
                    <>
                        {hasToken && showLogout && (
                            <button className="logout-button" onClick={logout}>Logout</button>
                        )}
                        
                        
                        <button className="register-button" onClick={register}>Register</button>,
                       
                    </>
                )
                }
            </div>
            <Outlet />
        </div>
    );
}
