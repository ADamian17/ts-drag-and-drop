export default class Component {
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
//# sourceMappingURL=Component.js.map