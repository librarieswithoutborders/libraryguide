import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PdfViewer from './PdfViewer'

const Resource = ({content, nextPrevFunctions, deleteResource, removeResource, updateResource}) => {
  console.log(content)
  let renderedContent
  switch(content.resource_type) {
    case "pdf":
      renderedContent = renderPdf(content)
      break
    case "video":
      renderedContent = renderVideo(content)
      break
    case "rich_text":
      renderedContent = renderRichText(content)
      break
  }

  return (
    <div className="resource">
      <div className="resource__header">
        <div className="resource__header__content">
          <h1 className="resource__header__text">{content.title}</h1>
            {/*{content.short_description &&
              <p>{content.short_description}</p>
            }
            {content.source_url &&
              <a href={"//" + content.source_url}>{content.source_organization || content.source_url}</a>
            }*/}
          <div className="resource__header__button-container">
            <h5 className="resource__header__button" onClick={() => updateResource(content)}>Edit Resource</h5>
            {removeResource &&
              <h5 className="resource__header__button" onClick={() => removeResource(content)}>Remove Resource From Collection</h5>
            }
            <h5 className="resource__header__button" onClick={() => deleteResource(content)}>Delete Resource</h5>
          </div>
        </div>
      </div>
      <div className="resource__content">
        {renderedContent}
        {content.disclaimer_message &&
          <div className="resource__disclaimer">
            <div className="resource__disclaimer__content" dangerouslySetInnerHTML={{__html:content.disclaimer_message}} />
          </div>
        }
      </div>
    </div>
  )
}

const renderVideo = ({video_provider, resource_url}) => {
  if (!resource_url) { return null }
  let videoContent;
  if (video_provider == "youtube") {
    videoContent = (
      <iframe
        src={resource_url}
        frameborder="0"
        allow="autoplay; encrypted-media">
      </iframe>
    )
  } else {
    videoContent = (
      <iframe
        src={resource_url}
        width="640"
        height="360"
        frameborder="0">
      </iframe>
    )
  }
  return (
    <div className="resource__video">
      {videoContent}
    </div>
  )
}

const renderRichText = ({rich_text}) => {
  return <div className="resource__richtext" dangerouslySetInnerHTML={{__html: rich_text}} />
}

const renderPdf = ({resource_url}) => {
  return <PdfViewer url={resource_url} />
}

export default Resource
