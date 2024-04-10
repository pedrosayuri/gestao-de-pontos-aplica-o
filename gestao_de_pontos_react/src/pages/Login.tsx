import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { Container, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';

const schema = z.object({
  email: z.string().email(({ message: 'Insira um e-mail válido' })),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
});

type FormData = {
  email: string;
  password: string;
};

export function Login() {
    const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_APP_API_URL;

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/login/`, {
                withCredentials: true,
                email: data.email,
                password: data.password
            });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            navigate('/home');
            setError(null);
        } catch (error) {
            setError('Erro ao fazer login. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container component="main" maxWidth="sm" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', justifyContent: 'center', alignItems: 'center', width: '85%' }}>
                <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '20px', color: '#1a1919', fontWeight: 'bold' }}>
                    <AccessAlarmsIcon style={{ marginRight: '10px' }} />
                    Ponto Fácil
                </Typography>
                {error && <Typography variant="body2" color="error" align="center" style={{ marginBottom: '10px' }}>{error}</Typography>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register('email')}
                                variant="outlined"
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('password')}
                                variant="outlined"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ marginTop: '20px', bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' }, padding: '15px 0' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="info" /> : 'Entrar'}
                    </Button>
                </form>
            </Container>
        </div>
    );
}
