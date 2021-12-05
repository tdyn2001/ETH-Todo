import React, { useRef } from "react";

function TodoList({ tasks, createTask, toggleCompleted, clearAll, error }) {
    const taskEl = useRef(null);
    const checkboxEl = useRef(null);
    const _createTask = () => {
        createTask(taskEl.current.value)
    }

    return (
        <div>
            <div id="content" class="text-center">
                <form onSubmit={(event) => {
                    event.preventDefault()
                    createTask(taskEl.current.value)
                }}>
                    <input id="newTask" ref={taskEl} type="text" className="form-control" placeholder="Add task..." required />
                    {(error != "") && (<div class="alert alert-danger error-message">
                        {error}
                    </div>)}
                    <br />
                    <input value="Create task" class="btn btn-primary" onClick={_createTask} />
                    <br />
                    <br />
                    <input value="Clear all" class="btn btn-danger" onClick={clearAll} />
                </form>
            </div>
            <div>
                <ul id="taskList" className="list-unstyled">
                    {tasks.map((task, key) => {
                        return (
                            <div className="taskTemplate" className="checkbox" key={key}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={task.id}
                                        checked={task.completed}
                                        ref={checkboxEl}
                                        onClick={(event) => {
                                            toggleCompleted(task.id)
                                        }} />
                                    <span>{" "}</span>
                                    <span className="content">{task.content}</span>
                                </label>
                            </div>
                        )
                    })}
                </ul>
                <ul id="completedTaskList" className="list-unstyled">
                </ul>
            </div>
        </div>
    );
}

export default TodoList;