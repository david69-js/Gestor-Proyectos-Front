import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tareas.css';

// Simulamos una lista de usuarios
const users = [
  { id: 1, name: 'Usuario 1' },
  { id: 2, name: 'Usuario 2' },
  { id: 3, name: 'Usuario 3' },
];

function Tareas() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [assignedUser, setAssignedUser] = useState('');

  // Simulamos la carga inicial de tareas
  useEffect(() => {
    setTasks([
      { id: 1, name: 'Tarea 1', assignedUser: 1 },
      { id: 2, name: 'Tarea 2', assignedUser: 2 },
    ]);
  }, []);

  // Crear tarea
  const handleCreateTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: taskName,
      assignedUser: assignedUser,
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setAssignedUser('');
  };

  // Actualizar tarea
  const handleUpdateTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, name: taskName, assignedUser: assignedUser } : task
    );
    setTasks(updatedTasks);
    setTaskName('');
    setAssignedUser('');
  };

  // Eliminar tarea
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Asignar tarea a un usuario
  const handleAssignUser = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, assignedUser: assignedUser } : task
    );
    setTasks(updatedTasks);
    setAssignedUser('');
  };

  // Desasignar tarea
  const handleUnassignUser = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, assignedUser: null } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="tareas-container">
      <h2>Gestión de Tareas</h2>

      {/* Formulario para crear o editar tarea */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          <option value="">Seleccionar usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateTask}>Crear Tarea</button>
      </div>

      <h3>Listado de Tareas</h3>

      {/* Lista de tareas */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h4>{task.name}</h4>
            <p>Asignada a: {task.assignedUser ? users.find((user) => user.id === task.assignedUser).name : 'Ninguno'}</p>

            <button onClick={() => navigate(`/tareas/${task.id}`)}>Editar</button>
            <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>

            {/* Asignar / Desasignar tarea */}
            <div>
              {task.assignedUser ? (
                <button onClick={() => handleUnassignUser(task.id)}>Desasignar Usuario</button>
              ) : (
                <button onClick={() => handleAssignUser(task.id)}>Asignar Usuario</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tareas;
