import path from 'path'
import fse from 'fs-extra'
import dateFormat from 'dateformat'

export default function deletePage (removeAt, callback) {
  'use strong'

  const now = new Date()
  const timestamp = dateFormat(now, 'dddd-mmmm-dS-yyyy-hh-MM-ss-TT')

  fse.move(
    path.join('__dirname', '..', 'manuscript', `page-${removeAt}`), 
    path.join('__dirname', '..', 'trash', `page-${removeAt}-${timestamp}`)
    )
    .then(() => {
      if (typeof callback === 'function') {
        callback()
      }
    }).catch((err) => {
      if (err) { return console.log('Something went wrong', err) }
    })
}
