var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './Component.js';
import ProjectItem from './project.item.js';
import { autoBind } from '../decorators/autobind.js';
import { Status } from '../helpers/helpers.js';
import { projectState } from '../state/projects.js';
export default class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.render();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'active' ? Status.Active : Status.Finished);
    }
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    render() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.type.toLocaleUpperCase()} PROJECTS`;
    }
    ;
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects) => {
            const filteredProjects = projects.filter(project => {
                if (this.type === 'active') {
                    return project.status === Status.Active;
                }
                return project.status === Status.Finished;
            });
            this.assignedProjects = filteredProjects;
            this.renderProjects();
        });
    }
    ;
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        this.assignedProjects.forEach(assignedProject => {
            new ProjectItem(this.element.querySelector('ul').id, assignedProject);
        });
    }
    ;
}
__decorate([
    autoBind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project.list.js.map