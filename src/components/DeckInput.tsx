import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './DeckInput.scss'

interface IDeckInputProps {
  onChange?: Function
  deckStr: string
  readOnly?: boolean
}

interface IDeckInputState {
  deckStr: string
}

class DiffSettingsModal extends React.Component<IDeckInputProps, IDeckInputState> {
  //
  constructor(props: IDeckInputProps) {
    super(props)
    
    this.state = {
      deckStr: props.deckStr,
    } as IDeckInputState
  }

  onFocusSelectAll = (e: any) => e.target.select()

  handleChange = (e: any) => {
    const deckStr = e.target.value || ''
    if (this.props.onChange) {
      this.setState({
        deckStr,
      }, this.props.onChange(deckStr))
    } else {
      this.setState({
        deckStr,
      })
    }
  }

  render(): React.ReactNode {
    return (
      <div className="DeckInput">
        <h4 className="deck-label">
          Deck B
        </h4>
        <textarea
          className="deck-text"
          value={this.props.deckStr}
          onChange={this.handleChange}
          onFocus={this.onFocusSelectAll}
          rows={15}
          readOnly={this.props.readOnly === true}></textarea>
        <div className="deck-stats">
          
        </div>
      </div>
    )
  }
}

export default DiffSettingsModal
