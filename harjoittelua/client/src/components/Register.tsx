import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
    setToken : Dispatch<SetStateAction<string>>,
    setUsername : Dispatch<SetStateAction<string>>
}

const Register: React.FC<Props> = (props : Props) : React.ReactElement => {
    const [msg, setMsg] = useState<string>('');

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>();

    const rekiteroidy = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if (lomakeRef.current?.username.value) {
            // tarkista aina eka käyttäjätunnus, ennen salasanaa
            // se on tietoturvan kautta parempi
            if (lomakeRef.current?.password.value) {

                if (lomakeRef.current?.password.value === lomakeRef.current?.password2.value) {
                    const yhteys = await fetch("/api/users", {
                        method : "POST",
                        headers : {
                            'Content-Type' : 'application/json'
                        },
                        body : JSON.stringify({
                            username : lomakeRef.current?.username.value,
                            password : lomakeRef.current?.password.value
                        })
                    });
    
                    if (yhteys.status === 200) {

                        setMsg('Käyttäjätunnus on nyt rekisteröity, voit nyt kirjautua sisään');
                        setTimeout( () => { 
                            setMsg('')
                            navigate("/login");
                        }, 5000);   
                        
                        
                    } else if (yhteys.status === 400) {
                        setMsg('Käyttäjänimi on jo rekisteröity');
                        setTimeout( () => { setMsg('')}, 10000);
                    }
                } else {
                    setMsg('Salasanat eivät täsmää');
                    setTimeout( () => { setMsg('')}, 10000);
                }
            } 
        } 
    };

    return (
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={rekiteroidy}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Rekisteröi uusi käyttäjätunnus</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="username"
                            />
                            <TextField 
                                label="Salasana"
                                name="password"
                                type="password" 
                            />
                            <TextField 
                                label="Salasana uudelleen"
                                name="password2"
                                type="password" 
                            />                            
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Rekisteröidy
                            </Button>

                        </Stack>

                          <Button onClick= { () => { navigate("/"); }}>Palaa takaisin</Button>
                        
                        <Typography sx={{marginTop: 10}}>{msg}</Typography>

                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default Register;
