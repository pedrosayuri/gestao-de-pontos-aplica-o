import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { z } from "zod";

import DateCalendarViews from "../components/DatePicker/DatePicker";
import TimePicker from "../components/TimePicker/TimerPicker";
import TextField from '@mui/material/TextField';
import { Container, Button, Grid, FormHelperText, FormControl } from "@mui/material";
import { CustomSnackbar } from "../components/BasicSnackbar";
import React from "react";
import { Dayjs } from "dayjs";

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
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
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
        if (!selectedDate) {
            setSnackbarMessage('Selecione uma data.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }

        if (!selectedTime) {
            setSnackbarMessage('Selecione um horário.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }

        if (!reasons) {
            setSnackbarMessage('Insira o motivo do ponto.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }

        try {
            validationSchema.parse({
                reasons,
                timestamp: selectedDate.format('YYYY-MM-DD') + ' ' + selectedTime.format('HH:mm'),});
        } catch (error) {
            setSnackbarMessage('Erro de validação. Por favor, verifique os dados informados.');
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            return;
        }
    
        try {
            if (selectedDate && selectedTime) {
                const timestampFormatted = selectedDate.format('DD-MM-YYYY') + ' ' + selectedTime.format('HH:mm');

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
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage('Erro ao enviar os dados.');
                setSnackbarOpen(true);
            }
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
                                <Grid container item xs={12} xl={6} justifyContent={"center"}>
                                    <FormControl sx={{marginBottom: '25px', marginTop: '15px'}} variant="outlined">
                                        <DateCalendarViews 
                                            onChange={(date: Dayjs | null) => {
                                                if (date) {
                                                    setSelectedDate(date);
                                                }
                                            }}
                                            value={null}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid container item xs={12} xl={6} justifyContent={"center"}>
                                    <FormControl sx={{marginBottom: '25px', marginTop: '15px'}} variant="outlined">
                                    <TimePicker 
                                            onChange={(time: Dayjs | null) => {
                                                setSelectedTime(time);
                                            }}
                                            value={selectedTime}
                                        />
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
