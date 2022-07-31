export enum EventType {
  Drag = "drag",
  DragEnd = "dragend",
  DragEnter = "dragenter",
  DragLeave = "dragleave",
  DragStart = "dragstart",
  DragOver = "dragover",
  Drop = "drop",
}

export enum DropEffects {
  Copy = "copy",
  Move = "move",
  Link = "link",
  None = "none",
}

export enum EffectsAllowed {
  None = "none",
  Copy = "copy",
  CopyLink = "copyLink",
  CopyMove = "copyMove",
  Link = "link",
  LinkMove = "linkMove",
  Move = "move",
  All = "all",
  uninitialized = "uninitialized",
}
