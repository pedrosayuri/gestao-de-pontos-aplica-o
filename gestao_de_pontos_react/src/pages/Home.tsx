import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { Container } from "@mui/material";


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
                console.log('decodedToken:', decodedToken.sub);
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
                    <Container component="main" maxWidth="md" style={{ marginTop: '55px', backgroundColor: '#cfcfcf', borderRadius: '10px', color:'#121214'}}>
                        <Box display="flex" justifyContent="center">
                            <nav aria-label="userslist">
                                <List>
                                    <ListItem>
                                    <ListItemButton onClick={() => navigate('/register')}>
                                        <ListItemIcon>
                                        <PersonAddAlt1Icon />
                                        </ListItemIcon>
                                        <ListItemText primary="Criar Novos Usuários" />
                                    </ListItemButton>
                                    </ListItem>
                                    <ListItem >
                                    <ListItemButton onClick={() => navigate('/user-list')}>
                                        <ListItemIcon>
                                        <PersonSearchIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Listar Usuários" />
                                    </ListItemButton>
                                    </ListItem>
                                    {/* <ListItem >
                                    <ListItemButton>
                                        <ListItemIcon>
                                        <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Editar Usuários" />
                                    </ListItemButton>
                                    </ListItem> */}
                                </List>
                                <List>    
                                    <ListItem>
                                    <ListItemButton onClick={() => navigate('/checkinout-list')}>
                                        <ListItemIcon>
                                        <FormatListBulletedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Listar Pontos" />
                                    </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav>
                            {/* <nav aria-label="secondary mailbox folders">
                                <List>    
                                    <ListItem>
                                    <ListItemButton onClick={() => navigate('/checkinout-list')}>
                                        <ListItemIcon>
                                        <FormatListBulletedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Listar Pontos" />
                                    </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav> */}
                        </Box>
                    </Container>
                    )}

                    {isUserComum && (
                        <Container component="main" maxWidth="md" style={{ marginTop: '55px', backgroundColor: '#cfcfcf', borderRadius: '10px', color:'#121214'}}>
                        <Box display="flex" justifyContent="center">
                            <nav aria-label="userslist">
                                <List>
                                    <ListItem>
                                    <ListItemButton onClick={() => navigate('/register-in-out')}>
                                        <ListItemIcon>
                                        <AccessAlarmsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Bater Ponto" />
                                    </ListItemButton>
                                    </ListItem>
                                </List>
                                <List>
                                    <ListItem>
                                    <ListItemButton onClick={() => navigate(`/list-work-hours/${user?.sub}`)}>
                                        <ListItemIcon>
                                        <FormatListBulletedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Listar Pontos" />
                                    </ListItemButton>
                                    </ListItem>
                                </List>
                            </nav>
                        </Box>
                    </Container>
                    )}
                </>
            )}
        </div>
    );
}