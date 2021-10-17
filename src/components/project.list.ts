import Component from './Component';
import ProjectItem from './project.item';
import Project from '../models/Project'

import { DragTarget } from '../models/drag-drop';
import { autoBind } from '../decorators/autobind';
import { ProjectStatus, Status } from '../helpers/helpers';
import { projectState } from '../state/projects';


/* NOTE Project List */
export default class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.render();
  }

  @autoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault()
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain')
    projectState.moveProject(
      projectId,
      this.type === 'active' ? Status.Active : Status.Finished
    );
  }

  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  render() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toLocaleUpperCase()} PROJECTS`
  };

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter(project => {
        if (this.type === 'active') {
          return project.status === Status.Active
        }

        return project.status === Status.Finished
      })

      this.assignedProjects = filteredProjects;
      this.renderProjects()
    });
  };

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';

    this.assignedProjects.forEach(assignedProject => {
      new ProjectItem(this.element.querySelector('ul')!.id, assignedProject)
    });
  };

}
