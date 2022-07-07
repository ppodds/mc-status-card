import {error, setFailed} from '@actions/core'
import {createCanvas, loadImage} from 'canvas'
import {
  NewPingResult,
  OldPingResult,
  ping,
  PingOptions
} from 'minecraft-protocol'
import {exit} from 'process'

interface CardInfo {
  players: {
    max: number
    online: number
  }
  description: string
  version: string
}

async function extractCardInfo(options: PingOptions): Promise<CardInfo> {
  try {
    const pingResult = await ping(options)
    if ((pingResult as OldPingResult).prefix) {
      // old version
      return {
        players: {
          max: (pingResult as OldPingResult).maxPlayers,
          online: (pingResult as OldPingResult).playerCount
        },
        description: (pingResult as OldPingResult).motd,
        version: pingResult.version as string
      }
    } else {
      return {
        players: {
          max: (pingResult as NewPingResult).players.max,
          online: (pingResult as NewPingResult).players.online
        },
        description:
          typeof (pingResult as NewPingResult).description === 'string'
            ? ((pingResult as NewPingResult).description as string)
            : (
                (pingResult as NewPingResult).description as {
                  text?: string | undefined
                }
              ).text || '',
        version: (pingResult as NewPingResult).version.name
      }
    }
  } catch (e: any) {
    error(e)
    setFailed(e.message)
    exit(1)
  }
}

export async function card(
  host: string,
  port: number,
  bgImage: string
): Promise<Buffer> {
  const cardInfo = await extractCardInfo({host, port})
  const WIDTH = 600
  const HEIGHT = 100
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  if (bgImage === '') {
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  } else {
    ctx.drawImage(await loadImage(bgImage), 0, 0, WIDTH, HEIGHT)
  }
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.font = '18px Impact'
  ctx.shadowBlur = 3
  ctx.shadowColor = 'rgb(0,0,0)'
  ctx.strokeText(host, 10, 30)
  ctx.fillText(host, 10, 30)
  ctx.strokeText(`Version: ${cardInfo.version}`, 10, 85)
  ctx.fillText(`Version: ${cardInfo.version}`, 10, 85)
  ctx.strokeText(
    `Players: ${cardInfo.players.online}/${cardInfo.players.max}`,
    230,
    85
  )
  ctx.fillText(
    `Players: ${cardInfo.players.online}/${cardInfo.players.max}`,
    230,
    85
  )
  return canvas.toBuffer()
}
