import { exit } from 'process'
import { Git, Run, Config } from './src'

export default function Setup (...args) {
  const providers = [ Git, Run, Config ]

  const output = providers
    .map(p => p.load(args))
    .reduce((acc, i) => ({ ...acc, ...i.data() }), {})

  console.log(JSON.stringify(output))
  
  return exit(0)
}
