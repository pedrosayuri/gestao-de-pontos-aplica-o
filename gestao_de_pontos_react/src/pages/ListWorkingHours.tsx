import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, TableHead, FormControl, Typography, Box } from "@mui/material";
import { format, parse } from "date-fns";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { enCA } from "date-fns/locale";

interface DecodedToken {
    name: string;
    roles: string[];
}

interface CheckInOutData {
    id: number;
    userId: number;
    timestamp: string;
    reasons: string;
}

interface WorkedHoursInADay {
    workedHoursInADay: string | null;
}

interface ExtraTime {
    extraTime: string;
}

interface RemainingTime {
    remainingTime: string;
}

export function ListWorkingHours() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();

    const [checkInOutData, setCheckInOutData] = useState<CheckInOutData[]>([]);
    const [workedHoursInADay, setWorkedHoursInADay] = useState<WorkedHoursInADay>();
    const [extraTime, setExtraTime] = useState<ExtraTime>({ extraTime: '00:00' });
    const [remainingTime, setRemainingTime] = useState<RemainingTime>({ remainingTime: '00:00' });
    const [isFullWorkDay, setIsFullWorkDay] = useState<boolean>(false);
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isUserComum, setIsUserComum] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const getToken = () => localStorage.getItem('token');

    const decodeToken = () => {
        const token = getToken();
        if (token) {
            try {
                setTokenIsValid(true);
                const decodedToken: DecodedToken = jwtDecode.jwtDecode(token);
                decodedToken.roles.forEach(role => {
                    switch (role) {
                        case 'ADMIN':
                            setIsUserAdmin(true);
                            break;
                        case 'COMUM':
                            setIsUserComum(true);
                            break;
                        default:
                            setTokenIsValid(false);
                            navigate("/");
                            break;
                    }
                });
            } catch (error) {
                // console.error('Erro ao decodificar o token:', error);
            }
        } else {
            setTokenIsValid(false);
            navigate("/");
        }
    }

    const getCheckInOutData = async (userId: string, date: string) => {
        try {
            const url = `${apiUrl}/current-day-journey-summary?userIdStr=${userId}&dateStr=${date}`;
            console.log('url:', url);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data:', data);
                setCheckInOutData(data.timePointsEntities);
                setWorkedHoursInADay(data.workedHoursInADay);
                setExtraTime(data.extraTime);
                setIsFullWorkDay(data.fullWorkDay);
                setRemainingTime(data.remainingTime);
                setIsDataLoaded(true);
            } else {
                setIsDataLoaded(false);
            }
        } catch (error) {
            setIsDataLoaded(false);
        }
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    }

    const handleConfirmButtonClick = () => {
        if (!id) {
            navigate("/error");
            return;
        }
    
        getCheckInOutData(id, selectedDate);
    }

    useEffect(() => {
        decodeToken();
    }, []);

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {(isUserAdmin || isUserComum) && (
                        <Container component="main" maxWidth="lg" style={{ marginTop: '55px', borderRadius: '10px', color:'#121214' }}>
                            <TableContainer component={Paper}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControl sx={{ m: 3, width: '30%' }} variant="outlined">
                                    <TextField
                                        id="date"
                                        label="Selecione uma data"
                                        type="date"
                                        defaultValue={selectedDate}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleDateChange}
                                    />
                                </FormControl>
                                <Button variant="contained" color="success" onClick={handleConfirmButtonClick}>Confirmar</Button>
                            </Box>
                                {isDataLoaded ? (
                                    <>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Data e Hora do Ponto</TableCell>
                                                    <TableCell align="center">Razões</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {checkInOutData.length > 0 && checkInOutData.map((data) => (
                                                <TableRow key={data.id}>
                                                    <TableCell align="center">{format(parse(data.timestamp, 'dd-MM-yyyy HH:mm', new Date()), 'dd/MM/yyyy \'às\' HH:mm:ss')}</TableCell>
                                                    <TableCell align="center">{data.reasons}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        </Table>
                                        {isFullWorkDay && (
                                            <>
                                                <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                    <CheckCircleIcon style={{ color: 'green', fontSize: 50 }} />
                                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                        Dia de trabalho completo.
                                                    </Typography>
                                                </div>
                                                <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                    Horas trabalhadas: {workedHoursInADay ? `${workedHoursInADay}` : 'N/A'}
                                                </Typography>
                                                </div>
                                            </>
                                        )}
                                        {extraTime.extraTime !== '00:00' && extraTime && (
                                            <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                    Tempo Extra: {extraTime ? `${extraTime}` : 'N/A'}
                                                </Typography>
                                            </div>
                                        )}
                                        {Array.isArray(remainingTime) && remainingTime.map((time, index) => (
                                            <div key={index} style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                    Horas restantes: {time.remainingTime}
                                                </Typography>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                        <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                            Nenhum ponto registrado para o dia selecionado.
                                        </Typography>
                                    </div>
                                )}
                                <div style={{ textAlign: 'center', width: '100%', marginTop: '16px', marginBottom: '16px' }}>
                                    <Button  
                                        variant="contained" 
                                        color="error"  
                                        onClick={() => {
                                            if (isUserComum) {
                                                navigate("/home");
                                            } else {
                                                navigate("/checkinout-list");
                                            }
                                        }}
                                    >
                                        Voltar
                                    </Button>
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
