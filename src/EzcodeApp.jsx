import { NavAuth } from "./ezcode/components/NavAuth"
//import { ChangeNav } from "./ezcode/components/changeNav"
import { AppRouter } from "./router/AppRouter"
import { AppTheme } from "./theme"

export const EzcodeApp = () => {
  return (
    <AppTheme>
      <NavAuth />
      <AppRouter />
    </AppTheme>
  )
}
