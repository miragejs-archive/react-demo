import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  let [users, setUsers] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let [error, setError] = useState(false);
  let isMounted = useRef(true);

  useEffect(() => {
    let fetchUsers = async function() {
      setIsLoading(true);
      let response = await fetch("/api/users");

      if (isMounted.current) {
        try {
          let json = await response.json();
          if (response.ok) {
            if (!json.users) {
              console.log("Received mirage response without users!");
              console.log("response", response);
              console.log("json", json);
              throw new Error("Bad state!");
            }
            setUsers(json.users);
          } else {
            setError(json.error);
          }
        } catch {
          setError("The server was unreachable!");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        <div data-testid="loading">Loading users...</div>
      ) : error ? (
        <div data-testid="error">{error}</div>
      ) : users.length > 0 ? (
        <ul data-testid="users">
          {users.map(user => (
            <li key={user.id} data-testid={`user-${user.id}`}>
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <div data-testid="no-users">Couldn't find any users!</div>
      )}
    </div>
  );
}
