/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Todo';
import { ErrorNotification } from './components/error/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const activeCount = todos.filter(todo => !todo.completed).length;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    // setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
    // .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {error && <div className="notification is-danger is-light">{error}</div>}
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      readOnly
                    />
                  </label>
                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    +{' '}
                    <div
                      className="
                      modal-background
                      has-background-white-ter"
                    />
                    + <div className="loader" />+{' '}
                  </div>
                </div>
              ))}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeCount} {activeCount === 1 ? 'item' : 'items'} left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                  data-cy="FilterLinkAll"
                  onClick={e => {
                    e.preventDefault();
                    setFilter('all');
                  }}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                  data-cy="FilterLinkActive"
                  onClick={e => {
                    e.preventDefault();
                    setFilter('active');
                  }}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                  data-cy="FilterLinkCompleted"
                  onClick={e => {
                    e.preventDefault();
                    setFilter('completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onClose={handleCloseError} />
      {/* <button data-cy="HideErrorButton" type="button" className="delete" /> */}
    </div>
  );
};
