import { ClienteNav } from './ClienteNav';
import { ProfeNav } from './ProfeNav';

export const ChangeCursoNav = () => {
    const tipo = localStorage.getItem('tipo');

    return (
        <div>
            {tipo === "Alumno" ? (
                <ClienteNav />
            ) : (
                <ProfeNav />
            )}
        </div>
    )
}
