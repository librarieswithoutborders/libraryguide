import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { Form, Text, Field } from 'react-form'

import PdfViewer from '../sitewide-components/PdfViewer'

import { uploadFile } from '../../actions/index'

class FileUploadFieldContent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currValue: props.fieldApi.value
    }
  }

  onDrop(files) {
    const {type} = this.props

    this.props.uploadFile({file: files[0], addHash: true, callback: this.uploadCallback.bind(this)})
  }

  clearValue() {
    this.props.fieldApi.setValue(null)
    this.setState({
      currValue: null
    })
  }

  getSnapshotOfPdf(canvasElem, fileUrl) {
    console.log(fileUrl)
    let splitPieces = fileUrl.split("/")
    let newFileUrl = splitPieces[splitPieces.length - 1].replace(".pdf", ".png")
    console.log("UPLOADING", newFileUrl)
    canvasElem.toBlob(blob => {
      let file = new File([blob], newFileUrl, {type: 'image/png'})
      this.props.uploadFile({file: file, addHash: false, callback: null})
    })
  }

  generatePreview() {
    const { type, fieldApi } = this.props
    const { setValue } = fieldApi
    const { currValue } = this.state
    let previewContent

    if (type === "pdf") {
      previewContent = <PdfViewer singlePage={true} renderCallback={(canvasElem) => this.getSnapshotOfPdf(canvasElem, currValue)} url={currValue} />
    } else {
      let styleObject = {backgroundImage: 'url("' + currValue + '")'}

      previewContent = <div className="form__image-upload__preview" style={styleObject} />
    }

    return (
      <div className="form__image-upload__preview-container">
        {previewContent}
        <button className="form__image-upload__change-image" onClick={() => this.clearValue() }>{type === "pdf" ? "Change PDF" : "Change Image"}</button>
      </div>
    )

  }

  uploadCallback(fileName) {
    const {type, fieldApi} = this.props
    const { setValue } = fieldApi

    console.log(fileName)

    setValue(fileName)
    this.setState({
      currValue: fileName
    })
  }

  render() {
    console.log(this.props)
    const { type, fieldApi, ...rest } = this.props
    const { value, setValue } = fieldApi

    // const error = getError()
    // const warning = getWarning()
    // const success = getSuccess()

    console.log(value)

    let preview = this.state.currValue ? this.generatePreview() : null

    return (
      <div className="form__image-upload">
        {preview}
        {!preview &&
          <Dropzone className="form__image-upload__image-input"
            onDrop={(files) => this.onDrop(files)} >
            <p>Drop image file here or click to select files to upload</p>
          </Dropzone>
        }
      </div>
    )
  }
}

class FileUploadField extends React.Component {
  render() {
    return (
      <Field field={this.props.field} >
        {fieldApi => {
          console.log(fieldApi)
          return <FileUploadFieldContent fieldApi={fieldApi} {...this.props} />
        }}
      </Field>
    )

  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: ({file, addHash, callback}) => {
      dispatch(uploadFile(file, addHash, callback))
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(FileUploadField)
