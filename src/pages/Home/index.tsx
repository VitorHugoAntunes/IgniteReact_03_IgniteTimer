import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' // * as para imports de arquivos/libs que nao tem export default

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

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
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
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
  // Funcao de validaca que usa o zod como resolver para validar os campos
  // Register serve para adicionar/guardar o valor do campo para sua validacao
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    console.log(data)
    // Retornando os campos para o valor default
    reset()
  }

  // Observa a mudanca do valor de task
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            // Spread operator para adicionar todos os valores do input + o valor do campo task como um value
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
