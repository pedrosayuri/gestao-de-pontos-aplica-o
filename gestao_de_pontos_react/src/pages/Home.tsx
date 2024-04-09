import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { OptionsCard }from "../components/OptionsCard";

import Box from '@mui/material/Box';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { Grid } from "@mui/material";

interface DecodedToken {
    name: string;
    roles: string[];
    sub: string;
}

export function Home() {
    const navigate = useNavigate();
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isUserComum, setIsUserComum] = useState(false);
    const [user, setUser] = useState<DecodedToken>();

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
                    } else if (role === 'COMUM') {
                        setIsUserComum(true);
                    }
                    setUser(decodedToken);
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

    return (
        <div>
            {tokenIsValid && (
                <>
                    <Navbar />
                    {isUserAdmin && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: '100px',
                            }}
                        >
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <OptionsCard icon={<PersonAddAlt1Icon sx={{ fontSize: 65 }} color="primary" />} text="Criar usuários" to="/register" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <OptionsCard icon={<PersonSearchIcon sx={{ fontSize: 65 }} color="primary" />} text="Listar usuários" to="/user-list" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <OptionsCard icon={<FormatListBulletedIcon sx={{ fontSize: 65 }} color="primary" />} text="Listar Pontos" to="/checkinout-list" />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {isUserComum && (
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: '100px',
                        }}
                        >
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <OptionsCard icon={<AccessAlarmsIcon sx={{ fontSize: 65 }} color="primary" />} text="Bater Ponto" to="/register-in-out" />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                <OptionsCard icon={<FormatListBulletedIcon sx={{ fontSize: 65 }} color="primary" />} text="Listar Pontos" to={`/list-work-hours/${user?.sub}`} />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </>
            )}
        </div>
    );
}
