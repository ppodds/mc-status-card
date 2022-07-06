import {test} from '@jest/globals'
import {card} from '../src/card'

test('run with no background image', async () => {
  await card('ppodds.website', 25565, '')
})

test('run with background image', async () => {
  await card('ppodds.website', 25565, 'https://i.imgur.com/MNt59oI.png')
})
