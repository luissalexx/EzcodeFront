import { ChangeNav } from "./ezcode/components/ChangeNav"
import { AppRouter } from "./router/AppRouter"
import { AppTheme } from "./theme"

export const EzcodeApp = () => {
  return (
    <AppTheme>
      <ChangeNav />
      <AppRouter />
    </AppTheme>
  )
}
