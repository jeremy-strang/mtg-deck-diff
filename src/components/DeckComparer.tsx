import { faGear, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './DeckComparer.scss'
import DeckInput from './DeckInput'
import DiffSettingsModal from './DiffSettingsModal'
import { Deck } from '../models/deck'

interface IProps {
}

interface IState {
  deckStrA: string
  deckStrB: string
  ignoredCardNames: string[]
  diffStr: string
  isSettingsModalOpen: boolean
}

class DeckComparer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)

    const deckStrA = window.localStorage ? window.localStorage.getItem('deckStrA') || '' : ''
    const deckStrB = window.localStorage ? window.localStorage.getItem('deckStrB') || '' : ''
    const ignoredCardNamesStr = window.localStorage ? window.localStorage.getItem('ignoredCardNames') || '' : ''
    const ignoredCardNames = ignoredCardNamesStr ? JSON.parse(ignoredCardNamesStr) || [] : []

    this.state = {
      deckStrA: deckStrA,
      deckStrB: deckStrB,
      diffStr: '',
      ignoredCardNames,
      isSettingsModalOpen: false,
    } as IState
  }

  computeDiffListStr = (deckStrA: string, deckStrB: string, ignoredCardNames: string[]): string => {
    const deckA = Deck.parse(deckStrA)
    const deckB = Deck.parse(deckStrB)
    
    if (window.localStorage) {
      window.localStorage.setItem('deckStrA', deckA.toString())
      window.localStorage.setItem('deckStrB', deckB.toString())
      window.localStorage.setItem('ignoredCardNames', JSON.stringify(ignoredCardNames))
    }

    return deckA.computeDiff(deckB, ignoredCardNames).toString()
  }

  onFocusSelectAll = (e: any) => e.target.select()

  handleChangeA = (deckStr: string) => {
    this.setState({
      deckStrA: deckStr,
    })
  }

  handleChangeB = (deckStr: string) => {
    this.setState({
      deckStrB: deckStr,
    })
  }

  onCompare = () => {
    this.setState({
      diffStr: this.computeDiffListStr(this.state.deckStrA, this.state.deckStrB, this.state.ignoredCardNames),
    })
  }

  onOpenSettingsModal =() => {
    this.setState({
      isSettingsModalOpen: true,
    })
  }

  onCloseSettingsModal = (updatedIgnoredCardNames?: string[]) => {
    const newState = {
      isSettingsModalOpen: false,
    } as IState
    
    if (updatedIgnoredCardNames) {
      newState.ignoredCardNames = updatedIgnoredCardNames
      if (this.state.deckStrA && this.state.deckStrB) {
        newState.diffStr = this.computeDiffListStr(this.state.deckStrA, this.state.deckStrB, newState.ignoredCardNames)
      }
    }
    this.setState(newState)
  }

  render(): React.ReactNode {
    let settingsModal: React.ReactNode | null = null

    if (this.state.isSettingsModalOpen) {
      settingsModal = <DiffSettingsModal
        onDone={this.onCloseSettingsModal}
        ignoredCardNames={this.state.ignoredCardNames}></DiffSettingsModal>
    }
    return (
      <div className="DeckComparer">
        <div className="header">
          <h3>Paste/enter your deck lists, then click the arrow button</h3>
        </div>

        <div className="buttons">
          <button onClick={this.onOpenSettingsModal}>
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>

        <div className="deck deck-a">
          <DeckInput
            deckStr={this.state.deckStrA}
            onChange={this.handleChangeA}
          ></DeckInput>
        </div>

        <div className="deck deck-b">
          <DeckInput
            deckStr={this.state.deckStrB}
            onChange={this.handleChangeB}
          ></DeckInput>
        </div>

        <div className="deck-compare">
          <button onClick={this.onCompare} className='btn-primary'>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        <div className="deck deck-diff">
          <DeckInput
            deckStr={this.state.diffStr}
            readOnly={true}
          ></DeckInput>
        </div>
        
        {settingsModal}
      </div>
    )
  }
}

export default DeckComparer
