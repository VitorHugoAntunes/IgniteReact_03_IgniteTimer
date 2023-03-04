import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import * as zod from 'zod' // * as para imports de arquivos/libs que nao tem export default

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
  StopCountdownButton,
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

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amounSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Funcao de validaca que usa o zod como resolver para validar os campos
  // Register serve para adicionar/guardar o valor do campo para sua validacao
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Tem um ciclo ativo no momento? se nao 0
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Diferenca em segundos da data de criacao do ciclo e a data atual pois o interval time out pode ser impreciso nos segundos
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        // Se a diferenca de segundos for maior que o total de segundos do ciclo, significa que o ciclo acabou
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      })
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = v4()
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    // Retornando os campos para o valor default
    reset()
  }

  function handleInterruptCycle() {
    // Percorrendo o array de ciclos e aplicando a interrupcao apenas pro ciclo ativo no momento atraves de seu ID
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  // Tem um ciclo ativo no momento? se nao 0
  const currentSeconds = activeCycle ? totalSeconds - amounSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  // Adicionando 0 na frente do numero caso nao tenha 2 digitos
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Timer no titulo da pagina
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}: ${seconds}`
    }
  }, [minutes, seconds, activeCycle])

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
            disabled={!!activeCycle}
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
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="submit" onClick={handleInterruptCycle}>
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
