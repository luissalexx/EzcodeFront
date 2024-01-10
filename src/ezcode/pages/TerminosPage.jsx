import React from 'react'
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { ChangeNav } from '../components/ChangeNav'
import { ChangeFootNav } from '../components/ChangeFootNav'

export const TerminosPage = () => {
    return (
        <div className='backTerminos'>
            <ChangeNav />
            <Container>
                <br />
                <Typography variant="h4">Términos y Condiciones de EZECODE</Typography>
                <br />
                <hr />
                <br />
                <Typography variant="h5">1. Registro y Autenticación:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="1.1. Para utilizar nuestros servicios, debes registrarte proporcionando información precisa y actualizada." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="1.2. EZECODE utiliza la autenticación a través de Google para la creación y acceso de cuentas. No se requiere la creación de una contraseña específica en nuestra plataforma." />
                    </ListItem>
                </List>
                <br />
                <Typography variant="h5">2. Compra de Cursos:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="2.1. Los cursos en EZECODE se adquieren a través de PayPal. Al realizar una compra, aceptas cumplir con los términos y condiciones de PayPal, además de los establecidos por EZECODE." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="2.2. Los cursos adquiridos son privados y se destinan exclusivamente a la interacción entre el usuario comprador y el profesor." />
                    </ListItem>
                </List>
                <br />
                <Typography variant="h5">3. Usuarios Menores de 18 Años:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="3.1. Si eres menor de 18 años, te recomendamos encarecidamente que utilices nuestros servicios bajo la supervisión de un adulto." />
                    </ListItem>
                </List>
                <br />
                <Typography variant="h5">4. Reporte entre Usuarios:</Typography>
                <Typography variant="body1">4.1. Los usuarios tienen la posibilidad de reportar a otros usuarios en casos específicos. Los puntos de reporte se otorgan según la siguiente escala:</Typography>

                <Typography variant="h6">Para Usuarios Clientes:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Conducta inadecuada y ofensiva: 3 puntos" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Inasistencia en el curso: 1 punto" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Incumplimiento/Desinterés en el curso: 1 punto" />
                    </ListItem>
                </List>

                <Typography variant="h6">Para Usuarios Profesores:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Contenidos incompletos: 3 puntos" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Conducta inadecuada y ofensiva: 3 puntos" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Nulo conocimiento de los temas: 5 puntos" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Contenido inapropiado: 5 puntos" />
                    </ListItem>
                </List>

                <Typography variant="body1">4.2. Los reportes son revisados por el equipo de EZECODE y pueden dar lugar a medidas disciplinarias, incluida la suspensión o eliminación de la cuenta, dependiendo de la gravedad de la situación.</Typography>
                <br />
                <Typography variant="h5">5. Contenido del Curso:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="5.1. Todo el contenido de los cursos en EZECODE está protegido por derechos de autor. No puedes copiar, distribuir ni utilizar el contenido con fines comerciales sin el permiso adecuado." />
                    </ListItem>
                </List>
                <br />
                <Typography variant="h5">6. Modificaciones del Servicio:</Typography>
                <Typography variant="body1">EZECODE se reserva el derecho de modificar o interrumpir sus servicios en cualquier momento sin previo aviso. No seremos responsables ante ti ni ante terceros por cualquier modificación, suspensión o interrupción de nuestros servicios.</Typography>
                <br />
                <Typography variant="h5">7. Limitación de Responsabilidad:</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="7.1. EZECODE no se hace responsable de cualquier daño directo, indirecto, incidental, especial, consecuente o punitivo que surja del uso de nuestros servicios." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="7.2. La responsabilidad total de EZECODE, ya sea en contrato, agravio, responsabilidad estricta o de otra manera, no superará el monto total pagado por ti al adquirir el curso." />
                    </ListItem>
                </List>
                <br />
                <Typography variant="h5">8. Ley Aplicable:</Typography>
                <Typography variant="body1">Estos términos y condiciones se rigen por las leyes del [país o región] y cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de [ciudad].</Typography>
                <br />
                <Typography variant="body1">Gracias por elegir EZECODE. Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nuestro equipo de soporte.</Typography>
                <br />
                <hr />
                <br />
            </Container>
            <br />
            <ChangeFootNav />
        </div>
    )
}
