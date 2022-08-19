import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './App.scss'
import DiffSettingsModal from './components/DiffSettingsModal'
import { Deck } from './helpers/deck'

interface IProps {
  deckStrA: string
  deckStrB: string
}

interface IState {
  deckStrA: string
  deckStrB: string
  ignoredCardNames: string[]
  diffStr: string
  isSettingsModalOpen: boolean
}

class App extends React.Component<IProps, IState> {
  private deckInputA: React.RefObject<HTMLTextAreaElement>
  private deckInputB: React.RefObject<HTMLTextAreaElement>
  private diffOutput: React.RefObject<HTMLTextAreaElement>

  constructor(props: IProps) {
    super(props)

    this.deckInputA = React.createRef<HTMLTextAreaElement>()
    this.deckInputB = React.createRef<HTMLTextAreaElement>()
    this.diffOutput = React.createRef<HTMLTextAreaElement>()

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

  resetScroll = () => {
    if (this.deckInputA && this.deckInputA.current) {
      this.deckInputA.current.scrollTop = 0
    }
    if (this.deckInputB && this.deckInputB.current) {
      this.deckInputB.current.scrollTop = 0
    }
    if (this.diffOutput && this.diffOutput.current) {
      this.diffOutput.current.scrollTop = 0
    }
    this.diffOutput.current?.focus()
  }

  computeDiffListStr = (deckStrA: string, deckStrB: string, ignoredCardNames: string[]): string => {
    const deckA = Deck.parse(deckStrA)
    const deckB = Deck.parse(deckStrB)
    
    if (window.localStorage) {
      window.localStorage.setItem('deckStrA', deckA.toString())
      window.localStorage.setItem('deckStrB', deckB.toString())
      window.localStorage.setItem('ignoredCardNames', JSON.stringify(ignoredCardNames))
    }

    return deckA.computeDiff(deckB, ignoredCardNames).toString(true)
  }

  handleChangeA = (e: any) => {
    this.setState({
      deckStrA: e.target.value,
    })
  }

  handleChangeB = (e: any) => {
    this.setState({
      deckStrB: e.target.value,
    })
  }

  onCompare = () => {
    this.resetScroll()
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
      <div className="App">
        <div className="item header">
          <h3>Paste/enter your deck lists, then click "Compare"</h3>
        </div>
        <div className="item buttons">
          <button onClick={this.onCompare} className='btn-primary'>Compare</button>
          <button onClick={this.onOpenSettingsModal}>
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
        <div className="item deck deck-a">
          <h4 className="deck-label">
            Deck A
          </h4>
          <textarea
            name="deck-a"
            className="deck-text"
            value={this.state.deckStrA}
            onChange={this.handleChangeA}
            ref={this.deckInputA}
            rows={15}></textarea>
        </div>
        <div className="item deck deck-b">
          <h4 className="deck-label">
            Deck B
          </h4>
          <textarea
            name="deck-b"
            className="deck-text"
            value={this.state.deckStrB}
            onChange={this.handleChangeB}
            ref={this.deckInputB}
            rows={15}></textarea>
        </div>
        <div className="item deck deck-diff">
          <h4 className="deck-label">
            Results
          </h4>
          <textarea
            name="deck-a"
            className="deck-text"
            value={this.state.diffStr}
            ref={this.deckInputB}
            onChange={this.handleChangeB}
            rows={15}
            readOnly={true}></textarea>
        </div>
        {settingsModal}
      </div>
    )
  }
}

export default App
