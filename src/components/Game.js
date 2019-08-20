import React, { Component, Fragment } from 'react'
import Board from './Board'
import NextPlayer from './NextPlayer'
import GameStatus from './GameStatus'
import RevertLastMove from './RevertLastMove'

class Game extends Component {
  state = {
    values: Array(9).fill(null),
    xIsNext: true,
    history: [Array(9).fill(null)],
  }

  revertLastMove = () => {
    this.setState(prevState => {
      if (prevState.history.length === 1) {
        return prevState
      } else {
        return {
          values: prevState.history[prevState.history.length - 2],
          history: prevState.history.slice(0, prevState.history.length - 1),
          xIsNext: !prevState.xIsNext,
        }
      }
    })
  }

  updateBoard = squareNumber => {
    this.setState(prevState => {
      const values = prevState.values.map((value, index) => {
        return index === squareNumber && value == null
          ? prevState.xIsNext
            ? 'X'
            : 'O'
          : value
      })
      return {
        values,
        xIsNext:
          prevState.values[squareNumber] == null
            ? !prevState.xIsNext
            : prevState.xIsNext,
        history:
          prevState.values[squareNumber] == null
            ? [...prevState.history, values]
            : prevState.history,
      }
    })
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]
      }
    }
    return null
  }

  restartGame = () => {
    this.setState({
      values: Array(9).fill(null),
      xIsNext: true,
    })
  }

  render() {
    const { values, xIsNext, history } = this.state
    const isDisabled = history.length === 1
    const offsets = [0, 3, 6]
    const winner = isDisabled ? null : this.calculateWinner(values)

    return (
      <Fragment>
        <NextPlayer xIsNext={xIsNext} />
        <Board
          offsets={offsets}
          values={values}
          updateBoard={this.updateBoard}
        />
        <RevertLastMove
          revertLastMove={this.revertLastMove}
          isDisabled={isDisabled}
        />
        <GameStatus winner={winner} restartGame={this.restartGame} />
      </Fragment>
    )
  }
}

export default Game
