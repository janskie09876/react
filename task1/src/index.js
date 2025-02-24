import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import './styles.css';


const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const EDIT_TASK = 'EDIT_TASK';

const addTask = (text) => ({ type: ADD_TASK, payload: { id: Date.now(), text, completed: false } });
const deleteTask = (id) => ({ type: DELETE_TASK, payload: id });
const toggleTask = (id) => ({ type: TOGGLE_TASK, payload: id });
const editTask = (id, text) => ({ type: EDIT_TASK, payload: { id, text } });


const initialState = { tasks: [] };
const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TASK:
            return { ...state, tasks: [...state.tasks, action.payload] };
        case DELETE_TASK:
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case TOGGLE_TASK:
            return {
                ...state,
                tasks: state.tasks.map(task => task.id === action.payload ? { ...task, completed: !task.completed } : task)
            };
        case EDIT_TASK:
            return {
                ...state,
                tasks: state.tasks.map(task => task.id === action.payload.id ? { ...task, text: action.payload.text } : task)
            };
        default:
            return state;
    }
};

const store = createStore(taskReducer);

function App() {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks);
    const [newTask, setNewTask] = React.useState('');
    const [editingTask, setEditingTask] = React.useState(null);
    const [editingText, setEditingText] = React.useState('');

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        dispatch(addTask(newTask));
        setNewTask('');
    };

    const handleEditTask = (task) => {
        setEditingTask(task.id);
        setEditingText(task.text);
    };

    const handleSaveEdit = (id) => {
        dispatch(editTask(id, editingText));
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
                <button className="add-button" onClick={handleAddTask}>Add</button>
            </div>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className="task-item">
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => dispatch(toggleTask(task.id))} 
                        />
                        {editingTask === task.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingText} 
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button className="save-button" onClick={() => handleSaveEdit(task.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <span>{task.text}</span>
                                <button className="edit-button" onClick={() => handleEditTask(task)}>Edit</button>
                            </>
                        )}
                        <button className="delete-button" onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
