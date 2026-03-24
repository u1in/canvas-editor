import { IElement } from '../../../../interface/Element'
import { ImageParticle } from '../ImageParticle'
import { LaTexSVG, LaTexUtils } from './utils/LaTexUtils'

export class LaTexParticle extends ImageParticle {
  public static convertLaTextToSVG(laTex: string): LaTexSVG {
    return new LaTexUtils(laTex).svg({
      SCALE_X: 10,
      SCALE_Y: 10,
      MARGIN_X: 0,
      MARGIN_Y: 0
    })
  }

  public render(
    ctx: CanvasRenderingContext2D,
    element: IElement,
    x: number,
    y: number
  ) {
    const { scale } = this.options
    const width = element.width! * scale
    const height = element.height! * scale
    const originFillStyle = ctx.fillStyle
    if (this.imageCache.has(element.value)) {
      const img = this.imageCache.get(element.value)!
      ctx.clearRect(x, y, width, height)
      ctx.fillStyle = 'white'
      ctx.fillRect(x - 1, y - 1, width + 2, height + 2)
      ctx.drawImage(img, x, y, width, height)
      ctx.fillStyle = originFillStyle
    } else {
      const laTexLoadPromise = new Promise((resolve, reject) => {
        const img = new Image()
        img.src = element.laTexSVG!
        img.onload = () => {
          ctx.clearRect(x, y, width, height)
          ctx.fillStyle = 'white'
          ctx.fillRect(x - 1, y - 1, width + 2, height + 2)
          ctx.drawImage(img, x, y, width, height)
          ctx.fillStyle = originFillStyle
          this.imageCache.set(element.value, img)
          resolve(element)
        }
        img.onerror = error => {
          reject(error)
        }
      })
      this.addImageObserver(laTexLoadPromise)
    }
  }
}
