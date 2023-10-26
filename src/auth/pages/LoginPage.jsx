import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { Grid, Link, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import ezcodeApi from '../../api/ezcodeApi';


export const LoginPage = () => {
  const { VITE_GOOGLE_CLIENT_ID } = getEnvVariables();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (tokenResponse) => {

    const resp = await ezcodeApi.post('auth/google', { id_token: tokenResponse.credential })
      .then(resp => {
        const { data } = resp;
        localStorage.setItem("token", data.token);
        localStorage.setItem("tipo", data.tipo);
        navigate('/',{
          replace: true
        });
        window.location.reload(false);
      })
      .catch(console.warn);
  }

  return (

    <AuthLayout title="Iniciar Sesion">
      <form>
        <Grid container>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12} sm={12}>
              <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={credentialResponse => handleGoogleLoginSuccess(credentialResponse)} theme="filled_black"
                  text="Iniciar Sesion con Google" logo_alignment="center" context="signin" shape="circle"
                  onFailure={res => {
                    console.log(res)
                  }
                  }
                />
              </GoogleOAuthProvider>
            </Grid>
          </Grid>

          <Grid container direction='row' justifyContent='end'>
            <Typography sx={{ mr: 1 }}>No tienes cuenta?</Typography>
            <Link component={RouterLink} color='inherit' to="/auth/registro">
              Registrate
            </Link>
          </Grid>

        </Grid>
      </form>

    </AuthLayout>
  )
}