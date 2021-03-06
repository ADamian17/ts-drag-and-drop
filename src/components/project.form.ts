import Component from './Component';
import { validate, Validatable } from '../utils/validation';
import { autoBind } from '../decorators/autobind';
import { projectState } from '../state/projects';

/* NOTE Project Form */
export default class ClientForm extends Component<HTMLDivElement, HTMLFormElement>{

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
