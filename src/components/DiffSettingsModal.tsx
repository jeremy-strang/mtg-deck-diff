import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import './DiffSettingsModal.scss'

interface IProps {
  onDone: Function
}

interface IState {
  skipCardNames: string
}

class DiffSettingsModal extends React.Component<IProps, IState> {
  // private deckInputA: React.RefObject<HTMLTextAreaElement>
  // private deckInputB: React.RefObject<HTMLTextAreaElement>
  // private diffOutput: React.RefObject<HTMLTextAreaElement>

  constructor(props: IProps) {
    super(props)

    // this.deckInputA = React.createRef<HTMLTextAreaElement>()
    // this.deckInputB = React.createRef<HTMLTextAreaElement>()
    // this.diffOutput = React.createRef<HTMLTextAreaElement>()

    let skipCardNames = window.localStorage ? window.localStorage.getItem('skipCardNames') || '' : ''
    this.state = {
      skipCardNames: skipCardNames || '',
    } as IState
  }

  // componentDidUpdate = () => {
  //   this.resetScroll()
  // }

  // resetScroll = () => {
  //   if (this.deckInputA && this.deckInputA.current) {
  //     this.deckInputA.current.scrollTop = 0
  //   }
  //   if (this.deckInputB && this.deckInputB.current) {
  //     this.deckInputB.current.scrollTop = 0
  //   }
  //   if (this.diffOutput && this.diffOutput.current) {
  //     this.diffOutput.current.scrollTop = 0
  //   }
  //   this.diffOutput.current?.focus()
  // }

  handleChange = (e: any) => {
    const skipCardNames = e.target.value || ''
    if (window.localStorage) {
      window.localStorage.setItem('skipCardNames', skipCardNames)
    }
    this.setState({
      skipCardNames,
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
                value={this.state.skipCardNames}
                onChange={this.handleChange}
                rows={15}></textarea>
            </div>
          </div>

          <div className="modal-btn-wrap">
            <button onClick={() => this.props.onDone()} v-show="previewMessages.length > 0" className="btn-primary">
              <FontAwesomeIcon icon={faFloppyDisk} /> Done
            </button>
          </div>

          {/* <div className="editor-is-busy" v-show="isBusy">
            <img src="../assets/img/spin64.svg" />
          </div> */}
        </div>
      </div>
    )
  }
}

export default DiffSettingsModal
