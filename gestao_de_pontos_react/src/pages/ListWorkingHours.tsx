import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, FormControl, Typography } from "@mui/material";
import { format } from "date-fns";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DateCalendarViews from "../components/DatePicker/DatePicker";
import { Dayjs } from "dayjs";

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

export function ListWorkingHours() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();

    const [checkInOutData, setCheckInOutData] = useState<CheckInOutData[]>([]);
    const [workedHoursInADay, setWorkedHoursInADay] = useState<WorkedHoursInADay>();
    const [extraTime, setExtraTime] = useState<string | null>(null);
    const [remainingTime, setRemainingTime] = useState<string | null>(null);
    const [isFullWorkDay, setIsFullWorkDay] = useState<boolean>(false);
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isUserComum, setIsUserComum] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
                console.error('Erro ao decodificar o token:', error);
            }
        } else {
            setTokenIsValid(false);
            navigate("/");
        }
    }

    const fetchCheckInOutData = async (userId: string, date: string) => {
        setCheckInOutData([]);
        setExtraTime("N/A");
        setIsFullWorkDay(false);
        setRemainingTime("N/A");
        setErrorMessage(null);
    
        try {
            const url = `${apiUrl}/current-day-journey-summary?userIdStr=${userId}&dateStr=${date}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setCheckInOutData(data.timePointsEntities);
            setWorkedHoursInADay(data.workedHoursInADay);
            setExtraTime(data.extraTime);
            setIsFullWorkDay(data.fullWorkDay);
            setRemainingTime(data.remainingTime);
        } catch (error) {
            setErrorMessage("Não foi encontrado nenhum dado.");
        }
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(format(date, 'yyyy-MM-dd'));
        }
    };

    const handleConfirmButtonClick = () => {
        if (!id) {
            navigate("/");
            return;
        }
        fetchCheckInOutData(id, selectedDate);
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
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                        Listagem de Pontos
                                    </Typography>
                                    <FormControl sx={{marginBottom: '25px', marginTop: '15px'}} variant="outlined">
                                        <DateCalendarViews 
                                            onChange={(date: Dayjs | null) => {
                                                if (date) {
                                                    handleDateChange(date.toDate());
                                                }
                                            }}
                                            value={null}
                                        />
                                    </FormControl>
                                    <Button variant="contained" color="success" onClick={handleConfirmButtonClick}>Confirmar</Button>
                                </div>
                                {errorMessage ? (
                                    <Typography variant="body1" color="error" align="center" style={{ marginTop: '15px' }}>
                                        {errorMessage}
                                    </Typography>
                                ) : (
                                    <>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Data e Hora do Ponto</TableCell>
                                                    <TableCell align="center">Razões</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {checkInOutData.map((data) => (
                                                <TableRow key={data.id}>
                                                    <TableCell align="center">{data.timestamp}</TableCell>
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
                                        {extraTime !== '00:00' && extraTime !== null && (
                                            <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                    Tempo Extra: {extraTime}
                                                </Typography>
                                            </div>
                                        )}
                                        {remainingTime !== '00:00' && remainingTime !== null && (
                                            <div style={{ textAlign: 'center', width: '100%', marginTop: '16px' }}>
                                                <Typography variant="h6" component="h2" gutterBottom style={{ color: 'black' }}>
                                                    Horas restantes: {remainingTime}
                                                </Typography>
                                            </div>
                                        )}
                                    </>
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
                </>
            )}
        </div>
    );
}
