"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    ;
})(App || (App = {}));
var App;
(function (App) {
    let Status;
    (function (Status) {
        Status[Status["Active"] = 0] = "Active";
        Status[Status["Finished"] = 1] = "Finished";
    })(Status = App.Status || (App.Status = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, numOfPeople) {
            const newProject = new App.Project(Math.random().toString(), title, description, numOfPeople, App.Status.Active);
            this.projects.push(newProject);
            this.updateListener();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find(project => project.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListener();
            }
        }
        updateListener() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    function validate(validatableObj) {
        let isValid = true;
        if (validatableObj.required) {
            isValid = isValid && validatableObj.value.toString().trim().length !== 0;
        }
        if (validatableObj.minLength != null &&
            typeof validatableObj.value === 'string') {
            isValid = isValid && validatableObj.value.length >= validatableObj.minLength;
        }
        if (validatableObj.maxLength != null &&
            typeof validatableObj.value === 'string') {
            isValid = isValid && validatableObj.value.length <= validatableObj.maxLength;
        }
        if (validatableObj.max != null &&
            typeof validatableObj.value === 'number') {
            isValid = isValid && validatableObj.value <= validatableObj.max;
        }
        if (validatableObj.min != null &&
            typeof validatableObj.value === 'number') {
            isValid = isValid && validatableObj.value >= validatableObj.min;
        }
        return isValid;
    }
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
    function autoBind(_, __, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDescriptor;
    }
    App.autoBind = autoBind;
    ;
})(App || (App = {}));
var App;
(function (App) {
    class Component {
        constructor(tempalateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(tempalateId);
            this.hostElement = document.getElementById(hostElementId);
            this.element = this.getImportedNode(this.templateElement).firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.insert(insertAtStart);
        }
        getImportedNode(node) {
            return document.importNode(node.content, true);
        }
        insert(isStart) {
            this.hostElement.insertAdjacentElement(isStart ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.render();
        }
        get persons() {
            return `Person${this.project.people > 1 ? 's' : ''}`;
        }
        onDragStart(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        onDragEnd(_) {
            console.log('Drag End');
        }
        configure() {
            this.element.addEventListener('dragstart', this.onDragStart);
            this.element.addEventListener('dragend', this.onDragEnd);
        }
        render() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = `${this.project.people} ${this.persons} assigned`;
            this.element.querySelector('p').textContent = this.project.description;
        }
    }
    __decorate([
        App.autoBind
    ], ProjectItem.prototype, "onDragStart", null);
    App.ProjectItem = ProjectItem;
    ;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
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
            App.projectState.moveProject(projectId, this.type === 'active' ? App.Status.Active : App.Status.Finished);
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
            App.projectState.addListener((projects) => {
                const filteredProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === App.Status.Active;
                    }
                    return project.status === App.Status.Finished;
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
                new App.ProjectItem(this.element.querySelector('ul').id, assignedProject);
            });
        }
        ;
    }
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    class ClientForm extends App.Component {
        constructor() {
            super('project-input', 'app', true, 'user-input');
            this.titleInputElement = this.element.querySelector('#title');
            this.descriptionInputElement = this.element.querySelector('#description');
            this.peopleInputElement = this.element.querySelector('#people');
            this.configure();
        }
        configure() {
            this.element.addEventListener('submit', this.handleSubmit);
        }
        ;
        render() { }
        ;
        gatherUserInput() {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;
            const titleValidatable = {
                value: enteredTitle,
                required: true
            };
            const descriptionValidatable = {
                value: enteredDescription,
                required: true,
                minLength: 5
            };
            const peopleValidatable = {
                value: enteredPeople,
                required: true,
                min: 1,
                max: 5
            };
            if (!App.validate(titleValidatable) &&
                !App.validate(descriptionValidatable) &&
                !App.validate(peopleValidatable)) {
                alert('invalid input, please try again');
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }
        ;
        clearInput() {
            this.titleInputElement.value = '';
            this.descriptionInputElement.value = '';
            this.peopleInputElement.value = '';
        }
        ;
        handleSubmit(e) {
            e.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                App.projectState.addProject(title, desc, people);
                this.clearInput();
            }
        }
        ;
    }
    __decorate([
        App.autoBind
    ], ClientForm.prototype, "handleSubmit", null);
    App.ClientForm = ClientForm;
})(App || (App = {}));
var App;
(function (App) {
    new App.ClientForm();
    new App.ProjectList('active');
    new App.ProjectList('finished');
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map