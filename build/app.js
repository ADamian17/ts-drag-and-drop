"use strict";
const projectTemplate = document.getElementById('single-project');
console.log(projectTemplate);
const projectListTemplate = document.getElementById('project-list');
console.log(projectListTemplate);
class ClientForm {
    constructor() {
        this.handleSubmit = (e) => {
            e.preventDefault();
            console.log(this.titleInputElement.value);
        };
        this.templateElement = this.findElById('project-input');
        this.hostElement = this.findElById('app');
        this.element = this.getImportedNode(this.templateElement).firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
        this.renderForm();
    }
    findElById(elementId) {
        return document.getElementById(elementId);
    }
    getImportedNode(node) {
        return document.importNode(node.content, true);
    }
    configure() {
        this.element.addEventListener('submit', this.handleSubmit);
    }
    renderForm() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
const App = new ClientForm();
