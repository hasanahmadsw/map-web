import React from 'react'

function DivHtml({ html }: { html: string }) {

  let safeHtml = ''
  
  if (typeof html === 'string') {
    safeHtml = html
  } else if (html !== null && html !== undefined) {
    safeHtml = String(html)
  }

  
  return (
    <div dangerouslySetInnerHTML={{ __html: safeHtml }} className="break-words" />
  )
}

export default DivHtml