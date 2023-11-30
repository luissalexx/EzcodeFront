import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Box, Button, TextField, TextareaAutosize, Typography } from '@mui/material';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { AuthLayout } from '../../auth/layout/AuthLayout';
import '../../styles.css'

export const ContactPage = () => {
    const { VITE_EMAIL_SERVICE_ID, VITE_EMAIL_TEMPLATE_ID, VITE_EMAIL_PUBLIC_ID } = getEnvVariables();
    const form = useRef();
    const [helperText, setHelperText] = useState('');

    const validateEmail = (email) => {
        const validDomains = ['@gmail.com', '@ceti.mx'];
        return validDomains.some((domain) => email.includes(domain));
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;

        if (validateEmail(email)) {
            setHelperText('');
        } else {
            setHelperText('Correo iválido. Por favor use los dominios @gmail.com o @ceti.mx.');
        }
    };

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(VITE_EMAIL_SERVICE_ID, VITE_EMAIL_TEMPLATE_ID, form.current, VITE_EMAIL_PUBLIC_ID)
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    return (
        <Box>
            <AuthLayout title="Contáctame">
                <p>Si tienes algún problema o pregunta sobre la página, no dudes en mandarme un correo para darte soporte</p>
                <form ref={form} onSubmit={sendEmail}>
                    <Typography sx={{ mr: 1 }}>Nombre</Typography>
                    <TextField type="text" name="user_name" fullWidth placeholder='Nombre' required />
                    <br />
                    <br />
                    <Typography sx={{ mr: 1 }}>Correo</Typography>
                    <TextField
                        type="email" name="user_email" fullWidth
                        onChange={handleEmailChange}
                        placeholder='Correo'
                        required
                        helperText={helperText}
                        error={helperText != ''} />
                    <br />
                    <br />
                    <TextareaAutosize name="message"
                        color="neutral"
                        minRows={10}
                        maxRows={10}
                        style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                        placeholder='Escribe aqui el mensaje'
                        required />
                    <br />
                    <br />
                    <Button variant='contained' fullWidth type='submit' value="Send" >Enviar</Button>
                </form>
            </AuthLayout>
        </Box>
    )
}