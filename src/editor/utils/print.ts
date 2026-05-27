import { PaperDirection } from '../dataset/enum/Editor'

function convertPxToPaperSize(width: number, height: number) {
  if (width === 1125 && height === 1593) {
    return {
      size: 'a3',
      width: '297mm',
      height: '420mm'
    }
  }
  if (width === 794 && height === 1123) {
    return {
      size: 'a4',
      width: '210mm',
      height: '297mm'
    }
  }
  if (width === 565 && height === 796) {
    return {
      size: 'a5',
      width: '148mm',
      height: '210mm'
    }
  }
  // 其他默认不转换
  return {
    size: '',
    width: `${width}px`,
    height: `${height}px`
  }
}

export interface IPrintImageBase64Option {
  width: number
  height: number
  direction?: PaperDirection
}

export function printImageBlob(
  blobList: Blob[],
  options: IPrintImageBase64Option
): Promise<void> {
  const { width, height, direction = PaperDirection.VERTICAL } = options
  return new Promise<void>((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.style.position = 'absolute'
    iframe.style.left = '0'
    iframe.style.top = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    document.body.append(iframe)
    const contentWindow = iframe.contentWindow!
    if (!contentWindow) {
      iframe.remove()
      reject(new Error('Failed to access iframe contentWindow'))
      return
    }
    const doc = contentWindow.document
    doc.open()
    const container = document.createElement('div')
    const paperSize = convertPxToPaperSize(width, height)
    // 使用 blob URL 替代 base64，避免大字符串开销
    const blobUrlList: string[] = []
    blobList.forEach(blob => {
      const blobUrl = URL.createObjectURL(blob)
      blobUrlList.push(blobUrl)
      const image = document.createElement('img')
      image.style.width =
        direction === PaperDirection.HORIZONTAL
          ? paperSize.height
          : paperSize.width
      image.style.height =
        direction === PaperDirection.HORIZONTAL
          ? paperSize.width
          : paperSize.height
      image.src = blobUrl
      container.append(image)
    })
    const style = document.createElement('style')
    const stylesheet = `
    * {
      margin: 0;
      padding: 0;
    }
    @page {
      margin: 0;
      size: ${paperSize.size} ${
      direction === PaperDirection.HORIZONTAL ? `landscape` : `portrait`
    };
    }`
    style.append(document.createTextNode(stylesheet))
    // 释放 blob URL 的清理函数
    const revokeBlobUrls = () => {
      blobUrlList.forEach(url => URL.revokeObjectURL(url))
    }
    setTimeout(() => {
      try {
        doc.write(`${style.outerHTML}${container.innerHTML}`)
        doc.close()
        // 等待 iframe 内所有 blob URL 图片加载完成后再打印
        const images = doc.querySelectorAll('img')
        const imageLoadPromises = Array.from(images).map(
          img =>
            new Promise<void>((resolveImg, rejectImg) => {
              if (img.complete) {
                resolveImg()
              } else {
                img.onload = () => resolveImg()
                img.onerror = () => rejectImg(new Error('Image load failed'))
              }
            })
        )
        Promise.all(imageLoadPromises).then(() => {
          contentWindow.addEventListener('afterprint', () => {
            revokeBlobUrls()
            iframe?.remove()
            resolve()
          }, {
            once: true
          })
          contentWindow.print()
          window.addEventListener(
            'mouseover',
            () => {
              revokeBlobUrls()
              iframe?.remove()
            },
            {
              once: true
            }
          )
        }).catch(err => {
          revokeBlobUrls()
          iframe?.remove()
          reject(err)
        })
      } catch (err) {
        revokeBlobUrls()
        iframe?.remove()
        reject(err)
      }
    })
  })
}
