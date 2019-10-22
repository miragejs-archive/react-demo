import React, { useEffect, useState, useRef } from "react";

const useIsMountedRef = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export default function() {
  let [pendingRequestIds, setPendingRequestIds] = useState([]);
  let [todos, setTodos] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let isMountedRef = useIsMountedRef();
  let isSaving = pendingRequestIds.length > 0;

  let done = todos.filter(todo => todo.isDone).length;

  function saveTodo(todo) {
    const requestId = Symbol();
    setPendingRequestIds([...pendingRequestIds, requestId]);

    let index = todos.findIndex(t => t.id === todo.id);

    setTodos(
      todos.map((oldTodo, i) => {
        if (i === index) {
          return todo;
        }

        return oldTodo;
      })
    );

    fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify(todo)
    }).then(() => {
      if (isMountedRef.current) {
        setPendingRequestIds(pendingRequestIds =>
          pendingRequestIds.filter(id => id !== requestId)
        );
      }
    });
  }

  function createTodo() {}
  function deleteCompleted() {}

  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(json => {
        setTodos(json);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-sm mx-auto py-6 px-4 bg-white shadow-lg rounded">
      <div className="flex justify-between items-center px-3">
        <h1 className="text-2xl font-bold">Todos</h1>

        <div className="text-blue-500">
          {isSaving && (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
            </svg>
          )}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-gray-500 px-3">Loading...</p>
        ) : (
          <div>
            <div className="px-3">
              <form onSubmit={createTodo}>
                <input
                  type="text"
                  v-model="newTodo.text"
                  placeholder="New todo"
                  className="bg-white px-3 py-2 shadow rounded block w-full focus:outline-none placeholder-gray-500"
                />
              </form>
            </div>

            <ul className="mt-8">
              {todos.map(todo => (
                <Todo
                  todo={todo}
                  onChange={saveTodo}
                  key={todo.id}
                  className="my-1"
                />
              ))}
            </ul>

            <div className="mt-12 px-3 flex justify-between font-medium text-gray-500 text-sm">
              {todos.length > 0 ? (
                <p>
                  {done} / {todos.length} complete
                </p>
              ) : null}
              {done > 0 ? (
                <button
                  onClick={deleteCompleted}
                  className="text-blue-500 font-medium focus:outline-none focus:text-blue-300"
                >
                  Clear completed
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function useRefState(initialState) {
  let [state, setState] = useState(initialState);
  let ref = useRef(state);

  function updateRefAndSetState(newState) {
    ref.current = newState;
    setState(newState);
  }

  return [ref, updateRefAndSetState];
}

function Todo({ todo, onChange }) {
  let [isFocused, setIsFocused] = useState(false);
  let [localTodoRef, setLocalTodo] = useRefState({ ...todo });

  function handleChange(event) {
    setLocalTodo({ ...localTodoRef.current, ...{ text: event.target.value } });
  }

  function handleCheck(event) {
    setLocalTodo({
      ...localTodoRef.current,
      ...{ isDone: event.target.checked }
    });

    commitChanges();
  }

  function handleSubmit(event) {
    event.preventDefault();
    commitChanges(localTodoRef.current);
  }

  function commitChanges() {
    setIsFocused(false);

    let hasChanges =
      localTodoRef.current.text !== todo.text ||
      localTodoRef.current.isDone !== todo.isDone;

    if (hasChanges) {
      onChange(localTodoRef.current);
    }
  }

  return (
    <li
      className={`
        rounded focus:bg-white border-2 flex items-center relative
        ${isFocused ? "bg-white border-gray-300" : null}
        ${!isFocused ? "border-transparent hover:bg-gray-200" : null}
        ${!isFocused ? localTodoRef.current.isDone && "opacity-50" : null}
      `}
    >
      <input
        type="checkbox"
        checked={localTodoRef.current.isDone}
        onChange={handleCheck}
        className="ml-2"
      />

      <form onSubmit={handleSubmit} className="w-full relative">
        <input
          type="text"
          value={localTodoRef.current.text}
          onChange={handleChange}
          placeholder="New Todo"
          onFocus={() => setIsFocused(true)}
          onBlur={commitChanges}
          className={`
            bg-transparent focus:outline-none px-3 py-1 block w-full
            ${localTodoRef.current.isDone && !isFocused ? "line-through" : null}
          `}
        />
      </form>
    </li>
  );
}
