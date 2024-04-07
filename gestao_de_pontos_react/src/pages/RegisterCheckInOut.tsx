import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from "zod";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import { Container, Typography, Button } from "@mui/material";
import { format } from "date-fns";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface ErrorApi {
    status: number;
    message: string;
}

const validationSchema = z.object({
    reasons: z.string(),
    timestamp: z.string(),
});

export function RegisterCheckInOut() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;
    const navigate = useNavigate();

    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserComum, setIsUserComum] = useState(false);

    const [reasons, setReasons] = useState("");
    const [timestamp, setTimestamp] = useState(format(new Date(), 'dd-MM-yyyy HH:mm'));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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
            return;
        }
    
        try {
            console.log('Enviando dados:', { reasons, timestamp });
            console.log('Token:', getToken());
            const timestampFormatted = format(timestamp, 'dd-MM-yyyy HH:mm');

            const response = await axios.post(`${apiUrl}/time-points/`, {
                reasons: reasons,
                timestamp: timestampFormatted,
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            console.log('Dados enviados com sucesso:', response.data);
            setSnackbarMessage('Dados enviados com sucesso.');
            setSnackbarOpen(true);
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
                    {isUserComum && (
                        <Container component="main" maxWidth="sm" style={{ marginTop: '55px', backgroundColor: '#cfcfcf', padding: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Cadastro de Pontos
                                    </Typography>
                                </div>
                                <div>
                                    <TextField
                                        label="Razões"
                                        variant="outlined"
                                        sx={{ m: 1, width: '56ch' }}
                                        autoComplete="off"
                                        value={reasons}
                                        onChange={(e) => setReasons(e.target.value)}
                                    />
                                    <TextField
                                        label="Data e Hora"
                                        variant="outlined"
                                        type="datetime-local"
                                        sx={{ m: 1, width: '56ch' }}
                                        value={timestamp}
                                        onChange={(e) => setTimestamp(e.target.value)}
                                    />
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
                </>
            )}
        </div>
    );
}
