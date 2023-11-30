import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { PanelCliente } from "../pages/panel/cliente/PanelCliente"
import { PanelProfesor } from "../pages/panel/profesor/PanelProfesor"
import { PanelAdmin } from "../pages/panel/administrador/PanelAdmin"
import { ContactPage } from "../pages/ContactPage"


export const EzcodeRoutes = () => {
  const tipo = localStorage.getItem('tipo')

  if (tipo == 'Alumno') {
    return (
      <Routes>
        <Route path="/user/" element={<PanelCliente />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
    )
  }

  if (tipo == 'Profesor') {
    return (
      <Routes>
        <Route path="/profesor/" element={<PanelProfesor />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
    )
  }

  if (tipo == 'Administrador') {
    return (
      <Routes>
        <Route path="/admin/" element={<PanelAdmin />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (tipo == null) {
    return (
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
    )
  }
}
