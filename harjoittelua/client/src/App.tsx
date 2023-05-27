import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import MainView from './components/MainView';
import Login from './components/Login';
import Register from './components/Register';
import { FetchSettings, ApiData, CredentialsTypes, UserPswChangeData } from './sharedInterfaces/sharedInterfaces';
import OwnSettings from './components/OwnSettings';

const App: React.FC = (): React.ReactElement => {
  const [token, setToken] = useState<string>(String(''));
  const [username, setUsername] = useState<string>(String(''));
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [apiData, setApiData] = useState<ApiData>({
    allCredentials: [],
    error: "",
    fetchReady: true
  });

  const apiCall = async (
    method?: string,
    credentials?: CredentialsTypes | UserPswChangeData,
    importToken?: string,
    id?: string,
    isUsersPasswordChange?: boolean): Promise<void> => {

    setApiData({
      ...apiData,
      fetchReady: false,
      error: ""
    });

    let url = `/api/credentials`;
    let authToken: string = token;

    // if it is PUT or DELETE, url needs the id:
    if (method === "PUT" || method === "DELETE") {
      url = `/api/credentials/${JSON.stringify(id)}`;
    }

    if (isUsersPasswordChange) {
      url = '/api/users';
    }

    // in some cases token statevariable is empty, so then user needs to send it by importToken
    if (importToken) { authToken = importToken }

    let settings: FetchSettings = {
      method: method || "GET",
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    if (method === "POST" || method === "PUT") {

      settings = {
        ...settings,
        headers: {
          ...settings.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }

    }

    try {

      const yhteys = await fetch(url, settings);

      if (yhteys.status === 200) {


        if (isUsersPasswordChange) {

          setMessage('Salasanasi on vaihdettu!');

          setApiData({
            ...apiData,
            fetchReady: true
          });

          setTimeout(() => {
            setMessage('')
          }, 3000);

        } else {

          setApiData({
            ...apiData,
            allCredentials: await yhteys.json(),
            fetchReady: true
          });

          // if it was POST or PUT, confirm, that credentials are now saved
          if (method === 'POST' || method === 'PUT') {

            setMessage('Tunnukset tallennettu!');
            setTimeout(() => {
              setMessage('')
            }, 3000);

          }
        }

      } else {

        let errorText: string = "";

        switch (yhteys.status) {

          case 401: errorText = "Vanha salasana meni väärin. Salasanaa ei vaihdettu."; break;
          case 400: errorText = "Virhe pyynnön tiedoissa"; break;
          default: errorText = "Palvelimella tapahtui odottamaton virhe"; break;

        }

        setApiData({
          ...apiData,
          error: errorText,
          fetchReady: true
        });

      }

    } catch (e: any) {

      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetchReady: true
      });

    }

  }

  useEffect(() => {

    // logs in, if user did not logged out
    const loggedUserJSON = window.localStorage.getItem('uDetails');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      setUsername(user.username);
      // fetches users saved credentials
      apiCall(undefined, undefined, user.token);
    }
  }, []);

  useEffect( () => {

    if (username) {
      apiCall();
    }
  }, [username]);

  return (
    <Container>

      <Routes>

        <Route path="/" element={<MainView
          username={username}
          token={token}
          setToken={setToken}
          setUsername={setUsername}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          apiCall={apiCall}
          message={message}
          apiData={apiData}
          setApiData={setApiData}
        />
        }
        />

        <Route path="/login" element={<Login
          setToken={setToken}
          setUsername={setUsername}
        />
        }
        />

        <Route path="/register" element={<Register
          setToken={setToken}
          setUsername={setUsername}
        />
        }
        />

        <Route path="/settings" element={<OwnSettings
          username={username}
          token={token}
          apiCall={apiCall}
        />
        }
        />

      </Routes>

    </Container>
  );
}

export default App;
