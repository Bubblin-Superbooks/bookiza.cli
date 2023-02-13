import shell from 'shelljs'

export default function start (options) {
  let port

  console.log(options)

  if (options !== undefined && options.port !== undefined && options.port % 1 === 0) {
    port = options.port
    shell.exec(`gulp --silent -p ${port}`)
  } else {
    shell.exec('gulp --silent')
  }
}