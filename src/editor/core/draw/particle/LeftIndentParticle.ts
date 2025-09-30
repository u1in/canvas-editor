// @ts-nocheck
import { DeepRequired } from '../../../interface/Common'
import { IEditorOption } from '../../../interface/Editor'
import { Draw } from '../Draw'

export class LeftIndentParticle {
  private draw: Draw
  private options: DeepRequired<IEditorOption>

  constructor(draw: Draw) {
    this.draw = draw
    this.options = draw.getOptions()
  }

  public drawLeftIndentText(
    ctx: CanvasRenderingContext2D,
    element: IElement,
    x: number,
    y: number
  ): void {
    const finalFontSize = this.options.defaultSize
    const finalFontFamily = this.options.defaultFont
    const font =
      element?.leftIndent?.fontStyle ||
      `${finalFontSize * this.options.scale}px ${finalFontFamily}`
    const text = element.leftIndent?.text || ''

    if (!text) return

    ctx.save()
    if (font) {
      ctx.font = font
    }
    // 设置文本对齐方式为右对齐
    ctx.textAlign = 'right'
    ctx.fillText(text, x, y)

    ctx.restore()
  }

  public measureTextWidth(
    ctx: CanvasRenderingContext2D,
    text: string,
    font?: string
  ): TextMetrics {
    if (!text) return ctx.measureText('')

    ctx.save()

    // 保存当前的字体设置
    const originalFont = ctx.font

    // 如果提供了字体，则使用提供的字体
    if (font) {
      ctx.font = font
    }

    // 测量文本宽度
    const textMetrics = ctx.measureText(text)

    // 恢复原来的字体设置
    ctx.font = originalFont

    ctx.restore()

    return textMetrics
  }

  public complete(): void {
    // 这个方法可以用于清理或完成绘制操作
    // 在当前实现中它是一个空方法，但保留它以保持与其他粒子类的一致性
  }
}
