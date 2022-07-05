import {test} from '@jest/globals'
import {card} from '../src/card'

test('test runs', async () => {
  await card('ppodds.website', 25565, '')
})
