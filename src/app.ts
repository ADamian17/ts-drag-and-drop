/// <reference path="./models/drag-drop.ts" />
/// <reference path="./models/Project.ts" />
/// <reference path="./state/projects.ts" />
/// <reference path="./utils/validation.ts" />
/// <reference path="./helpers/helpers.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/Component.ts" />
/// <reference path="./components/project.item.ts" />
/// <reference path="./components/project.list.ts" />
/// <reference path="./components/project.form.ts" />

namespace App {
  new ClientForm()
  new ProjectList('active');
  new ProjectList('finished');
}