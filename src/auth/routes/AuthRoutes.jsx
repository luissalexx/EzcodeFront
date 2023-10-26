import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage, RegisterPage } from "../pages"


export const AuthRoutes = () => {
    const token = localStorage.getItem('token')

    if (token == null) {
        return (
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="registro" element={<RegisterPage />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        )
    }else{
        return (
            <Routes>
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        )
    }
}
