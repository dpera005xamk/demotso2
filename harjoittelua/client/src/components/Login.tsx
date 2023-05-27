import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
    setToken : Dispatch<SetStateAction<string>>,
    setUsername : Dispatch<SetStateAction<string>>
}

interface DetailsOfUser {
    token: string,
    username: string
}

const Login: React.FC<Props> = (props : Props) : React.ReactElement => {
    const [msg, setMsg] = useState<string>('');

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>();

    const logIn = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if (lomakeRef.current?.username.value) {
            
            if (lomakeRef.current?.password.value) {

                const connection = await fetch("/api/auth/login", {
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        username : lomakeRef.current?.username.value,
                        password : lomakeRef.current?.password.value
                    })
                });

                if (connection.status === 200) {

                    let {token} = await connection.json(); // tästä palautuu objekt, jossa on ominaisuus suoraan, eli
                    // näin: res.json({ token : token }), niin sen takia aaltosulku, niin saadaan se.
                    // tossa fetch() varmaan ominaisuus json(), jolla voidaan hakea se palautettu arvo
                    // pitääpä tarkistaa...

                    props.setToken(token);
                    props.setUsername(lomakeRef.current?.username.value);

                    const userDetails: DetailsOfUser = {token: token, username: lomakeRef.current?.username.value}

                    localStorage.setItem("uDetails", JSON.stringify(userDetails));

                    navigate("/");

                } else if (connection.status === 401) {
                    setMsg('Käyttäjänimi tai salasana väärin');
                    setTimeout( () => { setMsg('')}, 10000);
                } else {
                    setMsg(`Tarkista, onko palvelin päällä. Virhekoodi: ${connection.status}`);
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
                        onSubmit={logIn}
                        ref={lomakeRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Kirjaudu sisään</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="username"
                            />
                            <TextField 
                                label="Salasana"
                                name="password"
                                type="password" 
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Kirjaudu
                            </Button>

                        </Stack>

                          <Button onClick= { () => { navigate("/"); }}>Palaa takaisin</Button>
                        
                        <Typography sx={{marginTop: 10}}>{msg}</Typography>

                    </Box>
                </Paper>
            </Backdrop>
    );
};

export default Login;
