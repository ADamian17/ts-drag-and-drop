namespace App {
  /* component class */
  export abstract class Component<HostElement extends HTMLElement, Element extends HTMLElement> {
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
}