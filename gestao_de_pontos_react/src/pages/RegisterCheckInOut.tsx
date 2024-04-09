import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from "zod";

import TextField from '@mui/material/TextField';
import { Container, Button, Grid, FormHelperText } from "@mui/material";
import { format } from "date-fns";
import { CustomSnackbar } from "../components/BasicSnackbar";
import React from "react";

interface DecodedToken {
    name: string;
    roles: string[];
}

const validationSchema = z.object({
    reasons: z.string().min(1, { message: 'Insira o motivo do ponto' }),
    timestamp: z.string().nonempty({ message: 'A data é obrigatória' }),
});

export function RegisterCheckInOut() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;
    const navigate = useNavigate();

    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserComum, setIsUserComum] = useState(false);

    const [reasons, setReasons] = useState("");
    const [timestamp, setTimestamp] = useState(format(new Date(), 'MM-dd-yyyy HH:mm'));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error" | "warning" | "info">("error");

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
                    if (role === 'COMUM') {
                        setIsUserComum(true);
                    } else {
                        setTokenIsValid(false);
                        navigate("/");
                    }
                });
            } catch (error) {
                setSnackbarOpen(true);
                setSnackbarSeverity('error');
                setSnackbarMessage('Erro ao decodificar o token.');
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
        if (!timestamp) {
            const currentDateTime = format(new Date(), 'dd-MM-yyyy HH:mm');
            setTimestamp(currentDateTime);
        }
        try {
            validationSchema.parse({
                reasons,
                timestamp,
            });
        } catch (error) {
            setSnackbarMessage('Erro de validação. Por favor, verifique os dados informados.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }
    
        try {
            const timestampFormatted = format(timestamp, 'dd-MM-yyyy HH:mm');

            await axios.post(`${apiUrl}/time-points/`, {
                reasons: reasons,
                timestamp: timestampFormatted,
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setSnackbarSeverity('success');
            setSnackbarMessage('Dados enviados com sucesso.');
            setSnackbarOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Erro ao enviar os dados.');
                setSnackbarOpen(true);
            }
        }
    };

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserComum && (
                        <Container component="main" maxWidth="md" style={{ marginTop: '55px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '85%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Razões"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="off"
                                        value={reasons}
                                        onChange={(e) => setReasons(e.target.value)}
                                    />
                                    <FormHelperText>Insira o motivo do ponto</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Data e Hora"
                                        variant="outlined"
                                        type="datetime-local"
                                        fullWidth
                                        value={timestamp}
                                        onChange={(e) => setTimestamp(e.target.value)}
                                    />
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
