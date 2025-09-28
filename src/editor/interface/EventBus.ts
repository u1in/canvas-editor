import {
  IContentChange,
  IControlChange,
  IControlContentChange,
  IImageMousedown,
  IImagePreviewSizeChange,
  IImageSizeChange,
  IInputEventChange,
  IIntersectionPageNoChange,
  IMouseEventChange,
  IPageModeChange,
  IPageScaleChange,
  IPageSizeChange,
  IPositionContextChange,
  IPreviewClear,
  IPreviewerOnDrag,
  IPreviewerOnDrop,
  IRangeStyleChange,
  ISaved,
  IVisiblePageNoListChange,
  IZoneChange
} from './Listener'

export interface EventBusMap {
  rangeStyleChange: IRangeStyleChange
  visiblePageNoListChange: IVisiblePageNoListChange
  intersectionPageNoChange: IIntersectionPageNoChange
  pageSizeChange: IPageSizeChange
  pageScaleChange: IPageScaleChange
  saved: ISaved
  contentChange: IContentChange
  controlChange: IControlChange
  controlContentChange: IControlContentChange
  pageModeChange: IPageModeChange
  zoneChange: IZoneChange
  mousemove: IMouseEventChange
  mouseleave: IMouseEventChange
  mouseenter: IMouseEventChange
  mousedown: IMouseEventChange
  mouseup: IMouseEventChange
  click: IMouseEventChange
  input: IInputEventChange
  positionContextChange: IPositionContextChange
  imageSizeChange: IImageSizeChange
  imageMousedown: IImageMousedown
  previewClear: IPreviewClear
  previewerOnDrag: IPreviewerOnDrag
  previewerOnDrop: IPreviewerOnDrop
  imagePreviewSizeChange: IImagePreviewSizeChange
}
