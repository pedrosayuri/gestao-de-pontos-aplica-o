import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { UserEdit } from '../pages/UserEdit';
import { Register } from '../pages/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserList } from '../pages/UserList';
import { CheckInOutList } from '../pages/CheckInOutList';
import { ListWorkingHours } from '../pages/ListWorkingHours';
import { RegisterCheckInOut } from '../pages/RegisterCheckInOut';

export function Router() {
    const handleNavigateToLogin = () => {
        localStorage.removeItem('token');
        return <Navigate to="/" />;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/user/:id" element={<UserEdit />} />
                <Route path="/checkinout" element={<CheckInOutList />} />
                <Route path="/workhours/:id" element={<ListWorkingHours />} />
                <Route path="/registerinout" element={<RegisterCheckInOut />} />
                <Route path="*" element={handleNavigateToLogin()} />
            </Routes>
        </BrowserRouter>
    );
}
