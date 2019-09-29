import React, { Component } from 'react';
import { getTasks, createTask } from '../api';

export default class TodoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            taskForm: { name: '' }
        };
    }

    async componentDidMount() {
        const tasks = await getTasks();
        this.setState({ tasks });
    }

    onCreateTask = async () => {
        const { taskForm, tasks } = this.state;
        const task = await createTask(taskForm);
        const tasksUpdated = [...tasks, task];
        this.setState({ tasks: tasksUpdated });
    };

    onFormChange = ({ target }) => {
        const taskForm = {
            ...this.state.taskForm,
            [target.name]: target.value
        };
        this.setState({ taskForm });
    };

    onCheckboxChange = ({ target }) => {
        const taskForm = {
            ...this.state.taskForm,
            completed: target.checked
        };
        this.setState({ taskForm });
    };

    render() {
        const { tasks, taskForm } = this.state;
        return (
            <div>
                <div>
                    <h1>Liste des tâches</h1>
                    {tasks.map(task => (
                        <div>
                            <span>{task.name}</span>
                            <span>&nbsp;&nbsp;Complété : </span>
                            <input type="checkbox" name="completed" onChange={this.onCheckboxChange} value={task.completed}/>
                        </div>
                    ))}
                </div>
                <div>
                    <h1>Ajouter une tâche</h1>
                    <div>
                        <input name="name" placeholder="Nom de la tâche" onChange={this.onFormChange} value={taskForm.name}/>
                        <button onClick={this.onCreateTask}>Valider</button>
                    </div>
                </div>
            </div>
        )
    }
}