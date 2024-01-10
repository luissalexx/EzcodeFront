import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { PanelCliente } from "../pages/panel/cliente/PanelCliente"
import { PanelProfesor } from "../pages/panel/profesor/PanelProfesor"
import { PanelAdmin } from "../pages/panel/administrador/PanelAdmin"
import { ContactPage } from "../pages/ContactPage"
import { MisAnunciosPage } from "../pages/panel/profesor/MisAnunciosPage"
import { AnuncioCreate } from "../pages/panel/profesor/anuncio/AnuncioCreate"
import { AnuncioEdit } from "../pages/panel/profesor/anuncio/AnuncioEdit"
import { SolicitudesPage } from "../pages/panel/administrador/SolicitudesPage"
import { BusquedaPage } from "../pages/BusquedaPage"
import { CarritoPage } from "../pages/CarritoPage"
import { SolicitudesProfePage } from "../pages/panel/profesor/SolicitudesProfePage"
import { MisCursosPage } from "../pages/panel/cliente/MisCursosPage"
import { CursoPage } from "../pages/curso/CursoPage"
import { CursosProfe } from "../pages/panel/profesor/CursosProfe"
import { TemaCreate } from "../pages/curso/components/TemaCreate"
import { TemaEdit } from "../pages/curso/components/TemaEdit"
import { TareaCreate } from "../pages/curso/components/TareaCreate"
import { TareaEdit } from "../pages/curso/components/TareaEdit"
import { ReportarUsuario } from "../pages/curso/components/ReportarUsuario"
import { ReportesPage } from "../pages/panel/administrador/ReportesPage"
import { ReportesUsuario } from "../pages/panel/administrador/components/ReportesUsuario"
import { TerminosPage } from "../pages/TerminosPage"


export const EzcodeRoutes = () => {
  const tipo = localStorage.getItem('tipo')

  if (tipo == 'Alumno') {
    return (
      <Routes>
        <Route path="/user/" element={<PanelCliente />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/cliente/Cursos" element={<MisCursosPage />} />
        <Route path="/cliente/cursoView/:id" element={<CursoPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/reportar/:idCurso" element={<ReportarUsuario />} />
      </Routes>
    )
  }

  if (tipo == 'Profesor') {
    return (
      <Routes>
        <Route path="/profesor/" element={<PanelProfesor />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/profesor/anuncios" element={<MisAnunciosPage />} />
        <Route path="/profesor/solicitudes" element={<SolicitudesProfePage />} />
        <Route path="/profesor/anuncioEdit/:id" element={<AnuncioEdit />} />
        <Route path="/profesor/Cursos" element={<CursosProfe />} />
        <Route path="/profesor/curso/tema/crear/:id" element={<TemaCreate />} />
        <Route path="/profesor/curso/tema/editar/:id/:idTema" element={<TemaEdit />} />
        <Route path="/profesor/curso/tarea/crear/:id" element={<TareaCreate />} />
        <Route path="/profesor/curso/tarea/editar/:id/:tareaId" element={<TareaEdit />} />
        <Route path="/reportar/:idCurso" element={<ReportarUsuario />} />
        <Route path="/profesor/cursoView/:id" element={<CursoPage />} />
        <Route path="/profesor/anuncio/crear" element={<AnuncioCreate />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (tipo == 'Administrador') {
    return (
      <Routes>
        <Route path="/admin/" element={<PanelAdmin />} />
        <Route path="/admin/solicitudes" element={<SolicitudesPage />} />
        <Route path="/admin/reportes" element={<ReportesPage />} />
        <Route path="/admin/reportes/usuario/:id" element={<ReportesUsuario />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (tipo == null) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }
}
