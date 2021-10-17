import { Status } from '../helpers/helpers';

/* NOTE Project class */
export default class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: Status
  ) {
  }
}
