import Component from './Component.js';
import Project from '../models/Project.js';

import { Draggable } from '../models/drag-drop.js';
import { autoBind } from '../decorators/autobind.js';

/* NOTE Project Item */
export default class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get persons() {
    return `Person${this.project.people > 1 ? 's' : ''}`
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)

    this.project = project;

    this.configure();
    this.render();
  }

  @autoBind
  onDragStart(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragEnd(_: DragEvent): void {
    console.log('Drag End');
  }

  configure() {
    this.element.addEventListener('dragstart', this.onDragStart);
    this.element.addEventListener('dragend', this.onDragEnd);
  }

  render() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.project.people} ${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }

};
