// Arquivo de definicao de tipos typescript
import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Criando uma tipagem de tema e atribuindo os valores de defaultTheme
type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  // Sobrescrevendo o valor padrao de default theme do styled components para o valor de temas definido nesta aplicacao
  export interface DefaultTheme extends ThemeType {}
}
