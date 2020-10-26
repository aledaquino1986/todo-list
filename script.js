class Todo {
  constructor(props) {
    this.title = props.title;
    this.description = props.description;
    this.dueDate = props.dueDate;
    this.priority = props.priority;
  }
}

class DomElements {
  constructor() {
    this.button = document.querySelector(".add");
    this.tbody = document.querySelector("tbody");
    this.section = document.querySelector(".table-section");
    this.form = document.querySelector("form");
    this.formSection = document.querySelector(".form");
    this.deleteTodosButton = document.querySelectorAll(".delete-todo")
    this.main = document.querySelector("main");
  }
}

const domElements = new DomElements();

class InputValues {
  constructor() {
    this.inputTitle = document.getElementById("title").value;
    this.inputDescription = document.getElementById("description").value;
    this.inputPriority = document.getElementById("priority").value;
    this.inputDueDate = document.getElementById("due-date").value;
  }
}

class UIcontrol {
  static displayTodos(todo) {
    const section = document.querySelector(".table-section");
   

    const todos = StoreTodos.getTodos();

    todos.forEach((todo) => {
      UIcontrol.addTodoToTable(todo);
    });
  }

  static addTodoToTable(todo) {
    const tbody = domElements.tbody;

    const row = document.createElement("tr");

    const strikeThroughCell = document.createElement("td");
    const inputStrikeThrough = document.createElement("input");
    inputStrikeThrough.setAttribute("type", "checkbox");
    inputStrikeThrough.setAttribute("name", "strike-through");
    inputStrikeThrough.className = "linethrough";
    strikeThroughCell.appendChild(inputStrikeThrough);
    row.appendChild(inputStrikeThrough);

    const titleCell = document.createElement("td");
    titleCell.innerText = todo.title;
    row.appendChild(titleCell);

    const description = document.createElement("td");
    description.innerText = todo.description;
    row.appendChild(description);

    const dueDateCell = document.createElement("td");
    dueDateCell.innerText = todo.dueDate;
    row.appendChild(dueDateCell);

    const priorityCell = document.createElement("td");
    priorityCell.innerText = todo.priority;
    row.appendChild(priorityCell);

    const deleteCell = document.createElement("td");
    const deleteCellButton = document.createElement("button");
    deleteCellButton.innerText = "X";
    deleteCellButton.className = "delete-todo";
    deleteCell.appendChild(deleteCellButton);
    row.appendChild(deleteCell);

    tbody.appendChild(row);

    if (domElements.section.classList.contains("hidden")) {
      domElements.section.classList.remove("hidden");
      domElements.main.classList.add("grid-main");
    }
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#priority").value = "";
    document.querySelector("#due-date").value = "";
  }

  static deleteTodo(elementToDelete) {
    const tbody = domElements.tbody;
    if (elementToDelete.classList.contains("delete-todo")) {
      elementToDelete.parentElement.parentElement.remove();
    }

    if (tbody.children.length == 0) {
      document.querySelector(".table-section").classList.add("hidden");
    }
  }

  static alertMessage(typeOfMessage) {
    const p = document.createElement("p");
    const paragraphWithAlertErrorClass = domElements.formSection.firstElementChild.classList.contains(
      "error"
    );
    const paragraphWithAlertSuccessClass = domElements.formSection.firstElementChild.classList.contains(
      "success"
    );

    if (typeOfMessage === "error") {
      if (paragraphWithAlertErrorClass) {
        return;
      }
      p.innerText = "Please fill in all inputs";
      p.className = "alert error";
      domElements.formSection.insertBefore(p, domElements.form);
    } else {
      if (paragraphWithAlertSuccessClass) {
        return;
      }
      p.innerText = "You have added a todo!";
      domElements.formSection.insertBefore(p, domElements.form);
      p.className = "alert success";
    }

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

class StoreTodos {
  static getTodos() {
    let todos;

    if (!localStorage.getItem("todos")) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
  }

  static addTodo(todo) {
    const todos = StoreTodos.getTodos();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
  }

  static removetodo(elementToDelete) {
    const todos = StoreTodos.getTodos();
    todos.forEach((todo, index) => {
      if (todo.title === elementToDelete) {
        todos.splice(index, 1);
      }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
  }
}



// Event Listeners

domElements.button.addEventListener("click", (e) => {
  e.preventDefault();

  const inputValues = new InputValues();

  if (
    !inputValues.inputTitle ||
    !inputValues.inputDescription ||
    !inputValues.inputPriority ||
    !inputValues.inputDueDate
  ) {
    UIcontrol.alertMessage("error");
  } else {
    const todoProps = {
      title: inputValues.inputTitle,
      description: inputValues.inputDescription,
      priority: inputValues.inputPriority,
      dueDate: inputValues.inputDueDate,
    };

    const todo = new Todo(todoProps);
    UIcontrol.addTodoToTable(todo);
    StoreTodos.addTodo(todo);

 

    UIcontrol.clearFields();
    UIcontrol.alertMessage("success");
  }
});

document.addEventListener("DOMContentLoaded", UIcontrol.displayTodos);



domElements.tbody.addEventListener("click", (e) => {
 
  if(e.target.classList.contains("delete-todo")) {
    UIcontrol.deleteTodo(e.target);
    console.log(e.target.parentElement.parentElement.children[1].innerText)
    const elementToDelete =
      e.target.parentElement.parentElement.children[1].innerText;
    StoreTodos.removetodo(elementToDelete);

    if (domElements.tbody.children.length == 0) {
      const main = document.querySelector("main");      
      domElements.main.classList.remove("grid-main");
     }
  } else if (e.target.classList.contains("linethrough")) {
    e.target.parentElement.className = "line-through"
  } else {
    return;
  }
  
 
});
