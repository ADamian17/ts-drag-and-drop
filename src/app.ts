/* dom vars */
const projectTemplate = document.getElementById('single-project') as HTMLTemplateElement;
console.log(projectTemplate);
const projectListTemplate = document.getElementById('project-list') as HTMLTemplateElement;
console.log(projectListTemplate);
class ClientForm {

  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = this.findElById('project-input')! as HTMLTemplateElement;
    this.hostElement = this.findElById('app')! as HTMLDivElement;

    this.element = this.getImportedNode(this.templateElement).firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

    this.configure()
    this.renderForm()
  }

  private findElById(elementId: string) {
    return document.getElementById(elementId)
  }

  private getImportedNode(node: any) {
    return document.importNode(node.content, true);
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }

  private renderForm() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const App = new ClientForm()
