namespace App {
  /* NOTE Status enum */
  export enum Status {
    Active,
    Finished
  }

  /* NOTE Project class */
  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: Status
    ) {

    }
  }
}