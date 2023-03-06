import { useContext } from 'react'
// import { v4 } from 'uuid'
import * as zod from 'zod' // * as para imports de arquivos/libs que nao tem export default
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

// import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import { CyclesContext } from '../../contexts/CyclesContext'

// controlled = atualizar informacoes em tempo real a cada mudanca - para formularios pequenos, simples, de login e cadastro por exemplo
// uncontrolled = atualizar informacoes apenas ao envio do submit, para formularios complexos com muitos inputs, ganho de performance
/**
 * function register(name: string) {
 *  return {
 *    onChange: () => void;
 *    onBLur: () => void; etc,
 *  }
 * }
 */

// Schema = modelo, molde, base
// Modelo de validacao do form de novo ciclo
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

// Criando uma tipagem a partir do schema do zod
// referenciando a variavel/objeto JS em tipagem TS com typeof, pois TS nao entende JS diretamente dentro dele
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // Funcao de validaca que usa o zod como resolver para validar os campos
  // Register serve para adicionar/guardar o valor do campo para sua validacao
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    // Retornando os campos para o valor default

    reset()
  }

  // Observa a mudanca do valor de task
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="submit" onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
