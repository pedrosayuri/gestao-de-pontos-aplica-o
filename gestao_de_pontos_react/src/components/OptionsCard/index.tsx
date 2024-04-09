import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export interface OptionsCardProps {
  icon: React.ReactElement;
  text: string;
  to: string;
}

export function OptionsCard({ icon, text, to }: OptionsCardProps) {
  const [hovered, setHovered] = React.useState<boolean>(false);

  const cardContent = (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <React.Fragment>
        <CardActions>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {icon}
            <Typography sx={{ fontSize: 28, textAlign: 'center' }} color="black" gutterBottom>
              {text}
            </Typography>
          </CardContent>
        </CardActions>
      </React.Fragment>
    </Link>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,        
        transition: 'transform 0.1s ease-in-out',
        transform: hovered ? 'scale(1) translateY(-15px)' : 'scale(1)',
        borderRadius: '10px',
        color: hovered ? 'white' : 'black',
        boxShadow: hovered ? '0 0 11px rgba(33,33,33,.2)' : '0 0 11px rgba(33,33,33,.1)',
        cursor: 'pointer',
        width: '100%',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card variant="outlined" sx={{ width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{cardContent}</Card>
    </Box>
  );
}
