/* NOTE Drag & Drop Interface */
interface Draggable {
  onDragStart(event: DragEvent): void;
  onDragEnd(event: DragEvent): void;
};


interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

/* NOTE Status enum */
enum Status {
  Active,
  Finished
}

/* NOTE Project class */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: Status
  ) {

  }
}

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
class ProjectState extends State<Project> {
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

const projectState = ProjectState.getInstance();

/* helpers */
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

type ProjectStatus = 'active' | 'finished';

function validate(validatableObj: Validatable) {
  let isValid = true;

  if (validatableObj.required) {
    isValid = isValid && validatableObj.value.toString().trim().length !== 0;
  }

  if (
    validatableObj.minLength != null &&
    typeof validatableObj.value === 'string'
  ) {
    isValid = isValid && validatableObj.value.length >= validatableObj.minLength;
  }

  if (
    validatableObj.maxLength != null &&
    typeof validatableObj.value === 'string'
  ) {
    isValid = isValid && validatableObj.value.length <= validatableObj.maxLength;
  }

  if (
    validatableObj.max != null &&
    typeof validatableObj.value === 'number'
  ) {
    isValid = isValid && validatableObj.value <= validatableObj.max;
  }

  if (
    validatableObj.min != null &&
    typeof validatableObj.value === 'number'
  ) {
    isValid = isValid && validatableObj.value >= validatableObj.min;
  }

  return isValid;
}

/* decorators */
function autoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn;
    }
  }

  return adjDescriptor;
};


/* component class */
abstract class Component<HostElement extends HTMLElement, Element extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: HostElement;
  element: Element;

  constructor(
    tempalateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {

    this.templateElement = document.getElementById(tempalateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as HostElement;
    this.element = this.getImportedNode(this.templateElement).firstElementChild as Element;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.insert(insertAtStart);
  }

  private getImportedNode(node: any) {
    return document.importNode(node.content, true);
  }

  private insert(isStart: boolean) {
    this.hostElement.insertAdjacentElement(
      isStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void
  abstract render(): void
}


/* NOTE Project Item */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

/* NOTE Project List */
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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


/* NOTE Project Form */
class ClientForm extends Component<HTMLDivElement, HTMLFormElement>{

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

    this.configure()
  }

  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  };

  render() { };

  private gatherUserInput(): [string, string, number] | undefined {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5
    }

    if (
      !validate(titleValidatable) &&
      !validate(descriptionValidatable) &&
      !validate(peopleValidatable)
    ) {
      alert('invalid input, please try again')
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  };

  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = ''
  };

  @autoBind
  private handleSubmit(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people);
      this.clearInput()
    }
  };

}

const clienForm = new ClientForm()
const activePrList = new ProjectList('active');
const finishedPrList = new ProjectList('finished');