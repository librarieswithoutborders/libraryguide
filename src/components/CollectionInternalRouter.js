import React, { Component } from 'react';
import { showAdminModal, fetchCollection } from '../actions/actions.js'
import { connect } from 'react-redux'
import Grid from './Grid'
import { Route, Switch } from 'react-router-dom'
import { PropsRoute } from '../utils/propsRoute'
import Collection from './Collection'

const RecursiveRouter = ({match, breadcrumbs, parent, parentType}) => {
  const {subPath} = match.params
  console.log("rendering ", subPath)
  console.log(breadcrumbs)

  let data = parent.subcollections

  let subcollectionData;
  data.forEach(d => {
    if (d.path === subPath) {
      subcollectionData = d
      return
    }
  })

  if (subcollectionData) {
    breadcrumbs.push({ title: subcollectionData.title, path: subcollectionData.path });
    console.log(breadcrumbs)
    return (
      <div>
        <PropsRoute exact path={match.path + "/"} component={Collection} breadcrumbs={breadcrumbs} parent={parent} parentType={parentType} data={subcollectionData} />
        <PropsRoute path={match.path + "/:subPath"} component={RecursiveRouter} breadcrumbs={breadcrumbs} parent={subcollectionData} parentType="subcollection"/>
      </div>
    )
  } else {
    return <h5>Sub Path not found</h5>
  }
}

const CollectionInternalRouter = ({match, data}) => {
  console.log(match, data)
  let breadcrumbs = [{ title: data.title, path: data.path }]
  return (
    <div>
      <PropsRoute exact path={match.path + "/"} component={Collection} breadcrumbs={breadcrumbs} data={data} />
      <PropsRoute path={match.path + "/:subPath"} component={RecursiveRouter} breadcrumbs={breadcrumbs} parent={data} parentType="collection"/>
    </div>
  )
}

export default CollectionInternalRouter
