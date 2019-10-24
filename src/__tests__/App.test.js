import React from "react";
import {
  render,
  waitForElement,
  waitForElementToBeRemoved,
  fireEvent
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { makeServer } from "../server";

let server;

beforeEach(() => {
  server = makeServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

it("shows a loading message", () => {
  const { getByTestId } = render(<App />);

  expect(getByTestId("loading")).toBeInTheDocument();
});

it("shows a message if there are no todos", async () => {
  const { getByTestId } = render(<App />);
  await waitForElementToBeRemoved(() => getByTestId("loading"));

  expect(getByTestId("no-todos")).toBeInTheDocument();
});

it("can create a todo", async () => {
  const { getByTestId } = render(<App />);
  await waitForElementToBeRemoved(() => getByTestId("loading"));

  const newTodoForm = await waitForElement(() => getByTestId("new-todo-form"));
  userEvent.type(newTodoForm.querySelector("input"), "Walk the dog");
  fireEvent.submit(getByTestId("new-todo-form"));
  await waitForElementToBeRemoved(() => getByTestId("saving"));

  const todo = getByTestId("todo");
  expect(todo.querySelector('input[type="checkbox"]').checked).toBe(false);
  expect(todo.querySelector('input[type="text"]').value).toBe("Walk the dog");
  expect(server.db.todos.length).toBe(1);
  expect(server.db.todos[0].text).toBe("Walk the dog");
});

it("shows existing todos", async () => {
  server.createList("todo", 3);

  const { getByTestId, getAllByTestId } = render(<App />);
  await waitForElementToBeRemoved(() => getByTestId("loading"));

  expect(getAllByTestId("todo")).toHaveLength(3);
});

it("can complete a todo", async () => {
  server.create("todo", { text: "Todo 1", isDone: false });
  server.create("todo", { text: "Todo 2", isDone: false });

  const { getByTestId, getAllByTestId } = render(<App />);
  await waitForElementToBeRemoved(() => getByTestId("loading"));
  const todos = getAllByTestId("todo");
  userEvent.click(todos[1].querySelector("input[type='checkbox']"));
  await waitForElementToBeRemoved(() => getByTestId("saving"));

  expect(todos[0].querySelector('input[type="checkbox"]').checked).toBe(false);
  expect(todos[1].querySelector('input[type="checkbox"]').checked).toBe(true);
  expect(server.db.todos[1].isDone).toBe(true);
});

// test("it will show an error message from the server", async () => {
//   server.get("/users", function() {
//     return new Response(
//       500,
//       { "Content-Type": "application/json" },
//       { error: "The database is on vacation" }
//     );
//   });

//   const { getByTestId, getByText } = render(<App />);

//   await waitForElement(() => getByTestId("error"));

//   expect(getByText("The database is on vacation")).toBeInTheDocument();
// });

// test("it will show an error message if the server is not respond with json", async () => {
//   server.get("/users", function() {
//     return new Response(500, { "Content-Type": "text/plain" }, "Bad gateway");
//   });

//   const { getByTestId, getByText } = render(<App />);

//   await waitForElement(() => getByTestId("error"));

//   expect(getByText("The server was unreachable!")).toBeInTheDocument();
// });

// test("it will show a message while the users are loading", async () => {
//   let respond;

//   // here we're going to tell our server to return a promise that
//   // doesnt resolve. this will make the http request sit in a
//   // a pending state, which means our react component will be
//   // prementely showing its loading message.
//   server.get("/users", () => {
//     return new Promise(resolve => {
//       respond = () => resolve({ users: [] });
//     });
//   });

//   let { getByTestId } = render(<App />);

//   expect(getByTestId("loading")).toBeInTheDocument();

//   // finally, let's respond so we don't leave it hanging forever :)
//   respond();
// });
