import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editingText, setEditingText] = useState('');

    const addTask = () => {
        if (newTask.trim() === '') return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setEditingText(task.text);
    };

    const saveEditing = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, text: editingText } : task));
        setEditingTask(null);
    };

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <div className="input-container">
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button className="add-button" onClick={addTask}>Add</button>
            </div>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className="task-item">
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleTask(task.id)} 
                        />
                        {editingTask === task.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingText} 
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button className="save-button" onClick={() => saveEditing(task.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <span>{task.text}</span>
                                <button className="edit-button" onClick={() => startEditing(task)}>Edit</button>
                            </>
                        )}
                        <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

root.render(<App />);
