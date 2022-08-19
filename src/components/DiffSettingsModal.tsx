import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import './DiffSettingsModal.scss'

interface IProps {
  onDone: Function
}

interface IState {
  ignoredCardNames: string
}

class DiffSettingsModal extends React.Component<IProps, IState> {
  //
  constructor(props: IProps) {
    super(props)

    let ignoredCardNames = window.localStorage ? window.localStorage.getItem('ignoredCardNames') || '' : ''
    this.state = {
      ignoredCardNames: ignoredCardNames || '',
    } as IState
  }

  handleChange = (e: any) => {
    const ignoredCardNames = e.target.value || ''
    if (window.localStorage) {
      window.localStorage.setItem('ignoredCardNames', ignoredCardNames)
    }
    this.setState({
      ignoredCardNames,
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
            <div className='DeckListWrap w100'>
              <h4>Ignore these card names:</h4>
              <textarea
                className='DeckList'
                value={this.state.ignoredCardNames}
                onChange={this.handleChange}
                rows={15}></textarea>
            </div>
          </div>

          <div className="modal-btn-wrap">
            <button onClick={() => this.props.onDone(this.state.ignoredCardNames.split('\n'))} className="btn-primary">
              <FontAwesomeIcon icon={faFloppyDisk} /> Done
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default DiffSettingsModal
