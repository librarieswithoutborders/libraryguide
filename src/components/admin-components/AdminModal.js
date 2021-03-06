import React, { Component } from 'react';
import { connect } from 'react-redux'

import ResourceCreator from './ResourceCreator'
import AdminForm from './AdminForm'
import Search from '../sitewide-components/Search'
import SvgIcon from '../sitewide-components/SvgIcon'

import {hideAdminModal, showWarningModal} from '../../actions/index'
import {createTeam, updateTeam, invalidateCurrTeam} from '../../actions/team'
import {createCollection, updateCollection, invalidateCurrCollection} from '../../actions/collection'
import {createSubcollection, updateSubcollection} from '../../actions/subcollection'
import {createResource, updateResource} from '../../actions/resource'
import {addUserToTeam} from '../../actions/user'
import processFormData from '../../utils/processFormData'


class AdminModal extends Component {
  constructor() {
    super()

    this.state = {
      resourceType: null
    }
  }

  setTitle() {
    const {type, action, data} = this.props
    let title = ""

    if (action === "create") {
      title += "Add "
    } else if (action === "add_user") {
      title += "Add User to "
    } else if (action === "add_team") {
      title += "Join New Team"
      return title
    } else {
      title += "Edit "
    }
    title += type.charAt(0).toUpperCase() + type.slice(1)

    return title
  }

  setContent() {
    const {type, data, action, showExisting, submit} = this.props
    const {resourceType} = this.state

    if (type === "resource" && action === "create" && !resourceType ) {
      return <ResourceCreator showExisting={showExisting} setResourceType={(type) => this.setResourceType(type)}/>
    } else if (type === "team" && action === "add_user") {
      return (
        <div className="admin-modal__contents__inner-container">
          <div className="admin-modal__subheading-container">
            <p className="admin-modal__subheading">Click on a user below to add them to your team.</p>
            <p className="admin-modal__subheading">Only users who have created accounts already can be added through this portal. Please ask any users who do not have an account to create one first.</p>
          </div>
          <Search type="user" onSelect={submit} />
        </div>
      )
    } else if (type === "user" && action === "add_team") {
      return <Search type="team" />
    } else {
      return (
        <AdminForm type={type} data={data} submit={submit} action={action} resourceType={resourceType} />
      )
    }
  }

  setResourceType(type) {
    this.setState({
      resourceType: type
    })
  }

  render() {
    const {type, data, action, hideAdminModal} = this.props
    return (
      <div className="admin-modal">
        <div className="admin-modal__header">
          <h1 className="admin-modal__header__text">{this.setTitle()}</h1>
          <div className="admin-modal__header__close" onClick={() => hideAdminModal()}>
            <SvgIcon name="close" />
          </div>
        </div>
        <div className="admin-modal__contents">
          {this.setContent()}
        </div>
      </div>
    )
  }
}

class AdminModalContainer extends Component {
  constructor(props) {
    super(props)
  }

  setSubmitFunction() {
    const {createTeam, updateTeam, createCollection, updateCollection, createSubcollection, updateSubcollection, createResource, updateResource, addUserToTeam} = this.props
    const {type, team, parent, user} = this.props.modalProps;

    switch(type) {
      case "team":
        return {
          create: data => {
            if (user && user._id) {
              createTeam({data:{users:[user._id], ...data}})
            } else {
              createTeam({data})
            }
          },
          update: data => updateTeam({data}),
          add_user: (user, team) => addUserToTeam(user, team)
        }
      case "collection":
        return {
          create: data => createCollection({data, team}),
          update: data => updateCollection({data})
        }
      case "subcollection":
        return {
          create: data => createSubcollection({data, parent}),
          update: data => updateSubcollection({data})
        }
      case "resource":
        return {
          create: data => createResource({data, parent, team}),
          update: data => updateResource({data})
        }
      case "user":
        return {}
    }
  }

  render() {
    const {action} = this.props.modalProps

    const submitFunc = this.setSubmitFunction()[action]

    return <AdminModal submit={submitFunc} hideAdminModal={this.props.hideAdminModal} {...this.props.modalProps} />
  }
}

const mapStateToProps = (state) => {
  return {
    modalProps: state.adminModalContent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTeam: (data) => dispatch(createTeam(data)),
    updateTeam: (data) => dispatch(updateTeam(data)),
    addUserToTeam: (user, team) => dispatch(addUserToTeam(user, team)),
    createCollection: (data) => dispatch(createCollection(data)),
    updateCollection: (data) => dispatch(updateCollection(data)),
    createSubcollection: (data) => dispatch(createSubcollection(data)),
    updateSubcollection: (data) => dispatch(updateSubcollection(data)),
    createResource: (data) => dispatch(createResource(data)),
    updateResource: (data) => dispatch(updateResource(data)),
    hideAdminModal: () => {
      dispatch(showWarningModal({
        message: 'Are you sure you want to leave?',
        submessage: 'Changes will not be saved.',
        options: [{text: 'Leave Editor', action: () => dispatch(hideAdminModal())}]
      }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminModalContainer)
