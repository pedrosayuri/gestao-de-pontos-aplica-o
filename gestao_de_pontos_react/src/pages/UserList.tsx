import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Grid, Button, CircularProgress } from "@mui/material";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface User {
    email: string;
    username: string;
    workRegime: string;
    userRole: string;
    createdAt: string;
}

export function UserList() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;

    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [filterUserRole, setFilterUserRole] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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
            setLoading(true);
            const response = await fetch(`${apiUrl}/users/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    console.log('Nenhum usuário encontrado.');
                }
                setUsers(data);
            } else {
                console.error('Erro ao buscar os usuários:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar os usuários:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = filterUserRole ? users.filter(user => user.userRole === filterUserRole) : users;

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilterUserRole(event.target.value);
    };

    useEffect(() => {
        decodeToken();
    }, []);

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserAdmin && (
                        <Container component="main" maxWidth="lg" style={{ marginTop: '55px', marginBottom: '55px', borderRadius: '10px', color:'#121214' }}>
                            <TableContainer component={Paper}>
                                <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Listagem de Usuários - Total: {filteredUsers.length}
                                    </Typography>
                                    
                                    <Grid item xs={12}>
                                        <FormControl style={{ width: '60%' }} variant="outlined">
                                            <InputLabel id="filterUserRole-label">Filtrar por Tipo de Usuário</InputLabel>
                                            <Select
                                                labelId="filterUserRole-label"
                                                id="filterUserRole"
                                                value={filterUserRole}
                                                onChange={handleFilterChange}
                                            >
                                                <MenuItem value="">Todos</MenuItem>
                                                <MenuItem value="ADMIN">Usuário Admin</MenuItem>
                                                <MenuItem value="COMUM">Usuário Comum</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </div>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Nome</TableCell>
                                        <TableCell align="center">Jornada de Trabalho</TableCell>
                                        <TableCell align="center">Tipo de Usuário</TableCell>
                                        <TableCell align="center">Criado em</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    {!loading ? <CircularProgress size={32} color="info" /> : 'Nenhum usuário encontrado.'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.email}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">{user.email}</TableCell>
                                            <TableCell align="center">{user.username}</TableCell>
                                            <TableCell align="center">
                                                {user.workRegime === 'OITO_HORAS' ? '8 Horas/Dia' : 
                                                (user.workRegime === 'SEIS_HORAS' ? '6 Horas/Dia' : user.workRegime)}
                                            </TableCell>
                                            <TableCell align="center">{user.userRole}</TableCell>
                                            <TableCell align="center">
                                            {format(new Date(user.createdAt).setHours(new Date(user.createdAt).getHours() - 3), 'dd/MM/yyyy \'às\' HH:mm:ss')}
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button variant="contained" color="error" size="large" onClick={() => navigate('/home')} style={{ width: '45%', marginTop: '15px', marginBottom: '25px' }} >Voltar</Button>
                                </Grid>
                            </TableContainer>
                        </Container>    
                    )}
                </>
            )}
        </div>
    );
}
