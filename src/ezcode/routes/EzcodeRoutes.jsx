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
        <Route path="/profesor/cursoView/:id" element={<CursoPage />} />
        <Route path="/profesor/anuncio/crear" element={<AnuncioCreate />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (tipo == 'Administrador') {
    return (
      <Routes>
        <Route path="/admin/" element={<PanelAdmin />} />
        <Route path="/admin/solicitudes" element={<SolicitudesPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (tipo == null) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buscar" element={<BusquedaPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }
}
