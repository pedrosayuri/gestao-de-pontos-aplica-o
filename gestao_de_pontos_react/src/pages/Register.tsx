import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from "zod";
import { CustomSnackbar } from "../components/BasicSnackbar";

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import { Grid, SelectChangeEvent } from '@mui/material';
import { Container, MenuItem, Select, Typography, Button } from "@mui/material";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface ErrosValidacao {
    email?: string;
    name?: string;
    password?: string;
    userRole?: string;
    workRegime?: string;
    [key: string]: string | undefined;
}

const validationSchema = z.object({
    email: z.string().email({ message: 'Insira um e-mail válido' }),
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    userRole: z.string().nonempty({ message: 'O campo de função do usuário não pode estar vazio' }),
    workRegime: z.string().nonempty({ message: 'O campo de regime de trabalho não pode estar vazio' })
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
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error" | "warning" | "info">("error");
    const [validationErrors, setValidationErrors] = React.useState<ErrosValidacao>({});

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleInputChange = (setStateFunction: React.Dispatch<React.SetStateAction<string>>, field: string) => {
        return (event: React.ChangeEvent<{ value: unknown }>) => {
            setStateFunction(event.target.value as string);
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            });
        };
    };

    const handleSelectChange = (setStateFunction: React.Dispatch<React.SetStateAction<string>>, field: string) => {
        return (event: SelectChangeEvent) => {
            setStateFunction(event.target.value);
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            });
        };
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
            if (error instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                error.errors.map(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setValidationErrors(fieldErrors);
                return;
            }
            setSnackbarMessage('Erro de validação. Por favor, verifique os dados informados.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }

        try {
            await axios.post(`${apiUrl}/users/`, {
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
            setSnackbarOpen(true);
            setSnackbarMessage('Usuário criado com sucesso!');
            setSnackbarSeverity('success');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSnackbarOpen(true);
                setSnackbarMessage('Não foi possível cadastrar esse usuário, por favor tente novamente!');
                setSnackbarSeverity('error');
            }
        }
    };

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserAdmin && (
                        <Container component="main" maxWidth="sm" style={{ marginTop: '55px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '85%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} style={{ textAlign: 'center' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Cadastro de Usuário
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email"
                                        id="outlined-basic"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="off"
                                        value={email}
                                        onChange={handleInputChange(setEmail, "email")}
                                        error={!!validationErrors["email"]}
                                        helperText={validationErrors["email"]}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nome"
                                        id="outlined-basic"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="off"
                                        value={name}
                                        onChange={handleInputChange(setName, "name")}
                                        error={!!validationErrors["name"]}
                                        helperText={validationErrors["name"]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ width: '100%' }} variant="outlined" error={!!validationErrors["password"]}>
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
                                            fullWidth
                                            value={password}
                                            onChange={handleInputChange(setPassword, "password")}
                                        />
                                        <FormHelperText>{validationErrors["password"]}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel id="userRole-select-label">Papel do Usuário</InputLabel>
                                        <Select
                                            labelId="userRole-select-label"
                                            id="userRole-select"
                                            value={userRole}
                                            onChange={handleSelectChange(setUserRole, "userRole")}
                                            label="Papel do Usuário"
                                            error={!!validationErrors["userRole"]}
                                        >
                                            <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                                            <MenuItem value={"COMUM"}>Colaborador</MenuItem>
                                        </Select>
                                        <FormHelperText error>{validationErrors["userRole"]}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel id="workRegime-select-label">Jornada de Trabalho</InputLabel>
                                        <Select
                                            labelId="workRegime-select-label"
                                            id="workRegime-select"
                                            value={workRegime}
                                            onChange={handleSelectChange(setWorkRegime, "workRegime")}
                                            label="Papel do Usuário"
                                            error={!!validationErrors["workRegime"]}
                                        >
                                            <MenuItem value={"SEIS_HORAS"}>6 Horas/Dia</MenuItem>
                                            <MenuItem value={"OITO_HORAS"}>8 Horas/Dia</MenuItem>
                                        </Select>
                                        <FormHelperText error>{validationErrors["workRegime"]}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={handleSubmit} fullWidth>Cadastrar</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="error" onClick={() => navigate('/home')} fullWidth>Voltar</Button>
                                </Grid>
                            </Grid>
                        </Container>
                    )}
                    <CustomSnackbar
                        open={snackbarOpen}
                        message={snackbarMessage}
                        severity={snackbarSeverity}
                        onClose={setSnackbarOpen}
                    />
                </>
            )}

        </div>
    );
}
