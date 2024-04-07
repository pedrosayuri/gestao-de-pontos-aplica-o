import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
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
                <Route path="/user-list" element={<UserList />} />
                <Route path="/checkinout-list" element={<CheckInOutList />} />
                <Route path="/list-work-hours/:id" element={<ListWorkingHours />} />
                <Route path="/register-in-out" element={<RegisterCheckInOut />} />
                <Route path="*" element={handleNavigateToLogin()} />
            </Routes>
        </BrowserRouter>
    );
}
