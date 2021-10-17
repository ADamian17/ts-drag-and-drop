import Project from '../models/Project.js';
import { Status } from '../helpers/helpers.js';

/* NOTE Listener custom type */
type Listener<ItemType> = (items: ItemType[]) => void;

/* NOTE State class */
class State<Item> {
  protected listeners: Listener<Item>[] = [];

  addListener(listenerFn: Listener<Item>) {
    this.listeners.push(listenerFn);
  }
}

/* NOTE Project state */
export default class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      Status.Active
    );

    this.projects.push(newProject);
    this.updateListener()
  }

  moveProject(projectId: string, newStatus: Status) {
    const project = this.projects.find(project => project.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListener()
    }
  }

  private updateListener() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
