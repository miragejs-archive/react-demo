import React from "react";
import { render, waitForElement } from "@testing-library/react";
import App from "./App";
import { makeServer } from "./server";
import { Response } from "miragejs";

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

it("shows a message if there are no todo", async () => {
  const { getByTestId } = render(<App />);

  await waitForElement(() => getByTestId("no-todos"));

  expect(getByTestId("no-todos")).toBeInTheDocument();
});

// it("shows a list of todos", async () => {
//   server.createList("todo", 3);

//   const { getByTestId } = render(<App />);

//   await waitForElement(() => getByTestId("no-todos"));

//   expect(getByTestId("no-todos")).toBeInTheDocument();
// });

// it("will show the name of a user", async () => {
//   server.create("user", { name: "Alice" });

//   const { getByTestId } = render(<App />);

//   await waitForElement(() => getByTestId("users"));

//   expect(getByTestId("user-1")).toHaveTextContent("Alice");
// });

// it("will show a list of users", async () => {
//   server.createList("user", 5);

//   const { getByTestId } = render(<App />);

//   await waitForElement(() => getByTestId("users"));

//   expect(getByTestId("users")).toContainElement(getByTestId("user-1"));
//   expect(getByTestId("users")).toContainElement(getByTestId("user-2"));
//   expect(getByTestId("users")).toContainElement(getByTestId("user-3"));
//   expect(getByTestId("users")).toContainElement(getByTestId("user-4"));
//   expect(getByTestId("users")).toContainElement(getByTestId("user-5"));
// });

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
