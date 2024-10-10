/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */

import * as datafile from "./data.js";
import * as view from "./view.js";

const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath();
  let column = null;

  for (const element of path) {
    const { area } = element.dataset;
    if (area) {
      column = area;
      break;
    }
  }

  if (!column) return;
  updateDragging({ over: column });
  updateDraggingHtml({ over: column });
};

const handleDragStart = (event) => {};
const handleDragEnd = (event) => {};

//Opens & closes help overlay
const handleHelpToggle = (event) => {
  if (view.html.help.overlay.open) {
    view.html.help.overlay.close();
    view.html.other.add.focus(); //4
  } else {
    view.html.help.overlay.show();
  }
};

//Opens & closes add order overlay and makes form blank ones you cancel order
const handleAddToggle = (event) => {
  if (view.html.add.overlay.open) {
    view.html.add.overlay.close();
    view.html.other.add.focus(); //4
  } else {
    view.html.add.overlay.show();
    view.html.add.form.reset();
  }
};

//Adds order to html element
const handleAddSubmit = (event) => {
  event.preventDefault();
  const title = view.html.add.title.value;
  const table = view.html.add.table.value;
  const order = datafile.createOrderData({ title, table, column: "ordered" });
  datafile.state.orders[order.id] = order;
  const orderElement = view.createOrderHtml(order);
  view.html.columns.ordered.appendChild(orderElement);
  view.html.add.overlay.close();
};

//Edit Order Overlay opens and closes without changes
const handleEditToggle = (event) => {
  if (view.html.edit.overlay.open) {
    view.html.edit.overlay.close();
  } else {
    view.html.edit.overlay.show();
  }
};

//Update edit submission and add columns to order/prep/serve
const handleEditSubmit = (event) => {
  event.preventDefault();
  const order = document.querySelector(".order");
  order.remove();

  const title = view.html.edit.title.value;
  const table = view.html.edit.table.value;
  const column = view.html.edit.column.value;
  const orderEdit = datafile.createOrderData({ title, table, column });
  datafile.state.orders[orderEdit.id] = orderEdit;
  const orderElement = view.createOrderHtml(orderEdit);
  view.html.columns[column].appendChild(orderElement);
  view.html.edit.overlay.close();
};

// Deletes order
const handleDelete = (event) => {
  const { target } = event;
  if (target == view.html.edit.delete) {
    document.querySelector(".order").remove();
  }
  view.html.edit.overlay.close();
};

view.html.add.cancel.addEventListener("click", handleAddToggle);
view.html.other.add.addEventListener("click", handleAddToggle);
view.html.add.form.addEventListener("submit", handleAddSubmit);

view.html.other.grid.addEventListener("click", handleEditToggle);
view.html.edit.cancel.addEventListener("click", handleEditToggle);
view.html.edit.form.addEventListener("submit", handleEditSubmit);
view.html.edit.delete.addEventListener("click", handleDelete);

view.html.other.help.addEventListener("click", handleHelpToggle);
view.html.help.cancel.addEventListener("click", handleHelpToggle);

for (const htmlColumn of Object.values(view.html.columns)) {
  htmlColumn.addEventListener("dragstart", handleDragStart);
  htmlColumn.addEventListener("dragend", handleDragEnd);
}

for (const htmlArea of Object.values(view.html.area)) {
  htmlArea.addEventListener("dragover", handleDragOver);
}