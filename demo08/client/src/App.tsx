import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Ostoslista from './components/Ostoslista';
import Login from './components/Login';

const App : React.FC = () : React.ReactElement => {
                            // kun String() wräpperillä ympäröity, niin jos tulee nullina niin 
                            // laittaa tyhjän stringin
  const [token, setToken] = useState<string>(String(localStorage.getItem("token")));

  return (
    <Container>
      
      <Typography variant="h5">Demo 8: Käyttäjähallinta</Typography>

      <Typography variant="h6" sx={{marginBottom : 2, marginTop : 2}}>Ostoslista</Typography>

      <Routes>
        <Route path="/" element={<Ostoslista token={token}/>}/>
        <Route path="/login" element={<Login setToken={setToken} />}/>
      </Routes>
      

    </Container>
  );
}

export default App;
