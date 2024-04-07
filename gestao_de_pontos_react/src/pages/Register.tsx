import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from "zod";

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import { Container, MenuItem, Select, Typography, Button } from "@mui/material";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface ErrorApi {
    status: number;
    message: string;
}

// Definindo esquema de validação com Zod
const validationSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(8),
    userRole: z.string().nonempty(),
    workRegime: z.string().nonempty()
});

export function Register() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;
    const navigate = useNavigate();

    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const [userRole, setUserRole] = React.useState("");
    const [workRegime, setWorkRegime] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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

    useEffect(() => {
        decodeToken();
    }, []);

    const handleSubmit = async () => {
        try {
            validationSchema.parse({
                email,
                name,
                password,
                userRole,
                workRegime
            });
        } catch (error) {
            setSnackbarMessage('Erro de validação. Por favor, verifique os dados informados.');
            setSnackbarOpen(true);
            return;
        }
    
        try {
            const response = await axios.post(`${apiUrl}/users/`, {
                email: email,
                username: name,
                password: password,
                userRole: userRole,
                workRegime: workRegime
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            console.log('Dados enviados com sucesso:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorResponse = error.response as { data: ErrorApi };
                console.error('Erro ao enviar dados:', errorResponse.data);
                console.log('Código de erro:', errorResponse.data.status);
                console.log('Mensagem de erro:', errorResponse.data.message);
                setSnackbarMessage(errorResponse.data.message);
                setSnackbarOpen(true);
            }
        }
    };

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserAdmin && (
                        <Container component="main" maxWidth="sm" style={{ marginTop: '55px', backgroundColor: '#cfcfcf', padding: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Cadastro de Usuário
                                    </Typography>
                                </div>
                                <div>
                                    <TextField
                                        label="Email"
                                        id="outlined-basic"
                                        variant="outlined"
                                        sx={{ m: 1, width: '56ch' }}
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <TextField
                                        label="Nome"
                                        id="outlined-basic"
                                        variant="outlined"
                                        sx={{ m: 1, width: '27ch' }}
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Senha"
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
                                        <InputLabel id="userRole-select-label">Papel do Usuário</InputLabel>
                                        <Select
                                            labelId="userRole-select-label"
                                            id="userRole-select"
                                            value={userRole}
                                            onChange={(event) => setUserRole(event.target.value)}
                                            label="Papel do Usuário"
                                        >
                                            <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                                            <MenuItem value={"COMUM"}>Colaborador</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
                                        <InputLabel id="workRegime-select-label">Jornada de Trabalho</InputLabel>
                                        <Select
                                            labelId="workRegime-select-label"
                                            id="workRegime-select"
                                            value={workRegime}
                                            onChange={(event) => setWorkRegime(event.target.value)}
                                            label="Papel do Usuário"
                                        >
                                            <MenuItem value={"SEIS_HORAS"}>6 Horas/Dia</MenuItem>
                                            <MenuItem value={"OITO_HORAS"}>8 Horas/Dia</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                        <Button variant="contained" onClick={handleSubmit} style={{ width: "97%" }}>Cadastrar</Button>
                                    </div>
                                </div>
                            </Box>
                        </Container>
                    )}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                        message={snackbarMessage}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    />
                    <h1>Register</h1>
                </>
            )}
        </div>
    );
}
