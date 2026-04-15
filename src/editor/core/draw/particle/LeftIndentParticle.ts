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
    const leftIndent = element.leftIndent
    const text = leftIndent?.text || ''
    
    if (!text) return

    // 检查是否启用缩进样式
    const enableIndentStyle = this.options.enableIndentStyle !== false

    // 获取样式属性
    // 如果未启用缩进样式，则使用默认值
    const color = enableIndentStyle
      ? (leftIndent?.color || this.options.defaultColor)
      : this.options.defaultColor
    const bold = enableIndentStyle ? leftIndent?.bold : undefined
    const fontFamily = enableIndentStyle
      ? (leftIndent?.fontFamily || this.options.defaultFont)
      : this.options.defaultFont
    const fontSize = leftIndent?.fontSize || this.options.defaultSize * this.options.scale

    // 组合字体字符串
    // 如果有 fontStyle 则优先使用（向后兼容）
    const font = leftIndent?.fontStyle ||
      `${bold ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`

    ctx.save()
    ctx.font = font
    ctx.fillStyle = color
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
