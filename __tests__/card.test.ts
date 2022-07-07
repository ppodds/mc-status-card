import {test, expect} from '@jest/globals'
import {card} from '../src/card'

test('run with no background image', async () => {
  expect(await card('smp.nftworlds.com', 25565, '')).toBeInstanceOf(Buffer)
})

test('run with background image', async () => {
  expect(
    await card('smp.nftworlds.com', 25565, 'https://i.imgur.com/MNt59oI.png')
  ).toBeInstanceOf(Buffer)
})
