import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import './DiffSettingsModal.scss'

interface IProps {
  onDone: Function
  ignoredCardNames: string[]
}

interface IState {
  ignoredCardNamesStr: string
}

class DiffSettingsModal extends React.Component<IProps, IState> {
  //
  constructor(props: IProps) {
    super(props)

    this.state = {
      ignoredCardNamesStr: props.ignoredCardNames.join('\n') || '',
    } as IState
  }

  handleChange = (e: any) => {
    const ignoredCardNamesStr = e.target.value || ''
    this.setState({
      ignoredCardNamesStr,
    })
  }

  render(): React.ReactNode {
    return (
      <div className="DiffSettingsModal modal-wrap">
        <div className="modal xs o-visible">
          <div className="modal-hdr">
            <div className="modal-title">
              Settings
            </div>
            <div className="modal-btns">
              <button onClick={() => this.props.onDone()} className="modal-x"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
          </div>
          
          <div className="modal-body o-visible">

            <div className="item deck deck-b">
              <h4 className="deck-label">
                List card names to ignore (one per line)
              </h4>
              <textarea
                name="deck-b"
                className="deck-text"
                value={this.state.ignoredCardNamesStr}
                onChange={this.handleChange}
                rows={15}></textarea>
            </div>
          </div>

          <div className="modal-btn-wrap">
            <button onClick={() => this.props.onDone(this.state.ignoredCardNamesStr.split('\n'))} className="btn-primary">
              <FontAwesomeIcon icon={faFloppyDisk} /> Save
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default DiffSettingsModal
