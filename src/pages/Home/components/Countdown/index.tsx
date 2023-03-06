import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amounSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

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
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      })
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

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

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
