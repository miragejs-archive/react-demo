import React from "react";

export default function() {
  return (
    <div>
      <h1 className="text-xl font-bold">About this app</h1>
      <p className="mt-4">
        This is an SPA made with{" "}
        <a className="underline" href="https://miragejs.com">
          Mirage
        </a>{" "}
        and{" "}
        <a className="underline" href="https://reactjs.org">
          React
        </a>
        . It has two routes to help demonstrate how Mirage's in-memory database
        enables realistic data fetching and persisting during a single
        application session.
      </p>
      <p className="mt-4">
        Mirage's state is reset whenever the application is reloaded.
      </p>
    </div>
  );
}
