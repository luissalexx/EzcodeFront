import { Route, Routes } from "react-router-dom"

import { AuthRoutes } from "../auth/routes/AuthRoutes"
import { EzcodeRoutes } from "../ezcode/routes/EzcodeRoutes"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"

export const AppRouter = () => {

  const { checkAuthToken } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [])
  

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={<EzcodeRoutes />} />
    </Routes>
  )
}
