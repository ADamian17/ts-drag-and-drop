/* NOTE Drag & Drop Interface */

namespace App {
  export interface Draggable {
    onDragStart(event: DragEvent): void;
    onDragEnd(event: DragEvent): void;
  };

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}
