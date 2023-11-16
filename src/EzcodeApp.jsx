import { AppRouter } from "./router/AppRouter"
import { AppTheme } from "./theme"

export const EzcodeApp = () => {
  return (
    <AppTheme>
      <AppRouter />
    </AppTheme>
  )
}
