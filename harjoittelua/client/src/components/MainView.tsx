import React, { useState, Dispatch, SetStateAction } from 'react';
import { Alert, Backdrop, Button, CircularProgress, IconButton, Container, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import PostNew from './PostNew';
import { CredentialsTypes, ApiData, SelectedProps } from '../sharedInterfaces/sharedInterfaces';
import CardActions from './CardActions';

interface MainViewTypes {
  username: string
  dialogOpen: boolean
  setUsername: Dispatch<SetStateAction<string>>
  setToken: Dispatch<SetStateAction<string>>
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  token: string
  apiCall: (method?: string, credentials?: CredentialsTypes) => Promise<void>
  setApiData: Dispatch<SetStateAction<ApiData>>
  message: string
  apiData: ApiData
};

const MainView: React.FC<MainViewTypes> = ({ username, setUsername, setToken, token, setDialogOpen, dialogOpen, apiCall, message, apiData, setApiData }): React.ReactElement => {
  const [selectedCard, setSelectedCard] = useState<SelectedProps>({
    id: '',
    action: ''
  })
  const navigate = useNavigate();

  return (
    <Container>

      {/* Buttons, while not logged in: */}

      {(username === '') ?
        <>
          <Button
            sx={{ margin: 1 }}
            variant="contained"
            size="small"
            onClick={() => {
              navigate('/login');
            }}>
            Kirjaudu sisään
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              navigate('/register');
            }}>
            Rekisteröidy
          </Button>
        </> :

        /* Buttons, while logged in */

        <Grid container spacing={1}>

          <Grid item lg={1}>
            <Typography>Moi, {username}</Typography>
          </Grid>

          <Grid item lg={2}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setUsername('');
                setToken('');
                localStorage.setItem("uDetails", '');
                setApiData({
                  ...apiData,
                  allCredentials: [],
                  fetchReady: true
                });
              }}>
              Kirjaudu ulos
            </Button>
          </Grid>

          <Grid item lg={4}>
            <Button
              onClick={() => { setDialogOpen(true) }}
              variant="outlined">
              Tallenna uudet tunnisteet
            </Button>
          </Grid>

          <Grid item lg={4}>
            <Button
              onClick={() => { navigate("/settings") }}
              variant="outlined"
              color="secondary">
              Omat asetukset
            </Button>
          </Grid>

        </Grid>
      }

      { // if message, show it here:
        (message !== '') ?
          <Alert severity="error">{message}</Alert> :
          <></>
      }


      {/* Show all credentials here */}
      {(Boolean(apiData.error))
        ? <Alert severity="error">{apiData.error}</Alert>
        : (apiData.fetchReady)
          ? <Grid
            container
            /*component="form"
            onSubmit={lisaaTuote}
            ref={lomakeRef}*/
            spacing={1}>

            { /* Left side of the grid */}

            <Grid item lg={6}>
              {apiData.allCredentials.map((cred: CredentialsTypes, idx: number) => {
                return <ListItem
                  key={idx}
                >
                  <IconButton
                    sx={{ marginRight: 2, color: "green" }}
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'show'
                      });
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    sx={{ marginRight: 2, color: "purple" }}
                    edge="end"
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'edit'
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    sx={{ marginRight: 2, color: "red" }}
                    edge="end"
                    onClick={() => {
                      setSelectedCard({
                        id: cred.id,
                        action: 'delete'
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <ListItemText
                    primary={cred.page}
                  />
                </ListItem>
              })}

            </Grid>

            {/* Right side of the grid */}

            <Grid item lg={6}>
              <CardActions
                apiData={apiData}
                selectedCard={selectedCard}
                apiCall={apiCall}
              />
            </Grid>

          </Grid> :
          <Backdrop open={true}>
            <CircularProgress color='inherit' />
          </Backdrop>
      }

      {/* Add new credentials */}
      <PostNew
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        apiCall={apiCall}
      />
      
    </Container>
  );
}

export default MainView;
