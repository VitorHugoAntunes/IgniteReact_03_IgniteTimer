import { ButtonContainer, ButtonVariant } from './Button.styles'

// Definindo a cor dos botoe atraves das propriedades - cor opcional
interface ButtonProps {
  variant?: ButtonVariant
}

// Definindo cor padrao caso nao tiver
export function Button({ variant = 'primary' }: ButtonProps) {
  return (
    // Atribuindo os estilos do botao e sua cor
    <ButtonContainer variant={variant}>Button</ButtonContainer>
  )
}
