import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
// import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Container, Typography } from "@mui/material";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface User {
    id: string;
    email: string;
    username: string;
    workRegime: string;
    userRole: string;
    createdAt: string;
}

export function CheckInOutList() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;

    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const getToken = () => {
        return localStorage.getItem('token');
    }

    const decodeToken = () => {
        const token = getToken();
        if (token) {
            try {
                setTokenIsValid(true);
                const decodedToken: DecodedToken = jwtDecode.jwtDecode(token);
                decodedToken.roles.forEach(role => {
                    if (role === 'ADMIN') {
                        setIsUserAdmin(true);
                        getAllUsers();
                    } else {
                        setTokenIsValid(false);
                        navigate("/");
                    }
                });
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        } else {
            setTokenIsValid(false);
            navigate("/");
        }
    }

    const getAllUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/users/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Erro ao buscar os usuários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar os usuários:', error);
        }
    }

    useEffect(() => {
        decodeToken();
    }, []);

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserAdmin && (
                        <Container component="main" maxWidth="lg" style={{ marginTop: '55px', borderRadius: '10px', color:'#121214' }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell align="center">Nome</TableCell>
                                    <TableCell align="center">Jornada de Trabalho</TableCell>
                                    <TableCell align="center">Ver Pontos</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{user.username}</TableCell>
                                        <TableCell align="center">
                                            {user.workRegime === 'OITO_HORAS' ? '8 Horas/Dia' : 
                                            (user.workRegime === 'SEIS_HORAS' ? '6 Horas/Dia' : user.workRegime)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" onClick={() => navigate(`/list-work-hours/${user.id}`)}>Ver Pontos</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                                </Table>
                                <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Total de usuários: {users.length}
                                    </Typography>
                                </div>
                            </TableContainer>
                        </Container>    
                    )}
                    <h1>UserList</h1>
                </>
            )}
        </div>
    );
}
