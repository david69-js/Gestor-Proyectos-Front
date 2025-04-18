// src/pages/EditarTarea.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Simulamos una lista de usuarios
const users = [
  { id: 1, name: 'Usuario 1' },
  { id: 2, name: 'Usuario 2' },
  { id: 3, name: 'Usuario 3' },
];

// Simulamos las tareas existentes
const tasks = [
  { id: 1, name: 'Tarea 1', assignedUser: 1 },
  { id: 2, name: 'Tarea 2', assignedUser: 2 },
];

function EditarTarea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [assignedUser, setAssignedUser] = useState('');

  // Cargar la tarea cuando se pase el id en la URL
  useEffect(() => {
    const taskToEdit = tasks.find((task) => task.id === parseInt(id));
    if (taskToEdit) {
      setTask(taskToEdit);
      setTaskName(taskToEdit.name);
      setAssignedUser(taskToEdit.assignedUser || '');
    }
  }, [id]);

  // Guardar los cambios realizados en la tarea
  const handleSave = () => {
    const updatedTask = { ...task, name: taskName, assignedUser: assignedUser };
    console.log('Tarea actualizada:', updatedTask);
    navigate('/tareas');  // Redirigir a la lista de tareas
  };

  return task ? (
    <div>
      <h2>Editar Tarea</h2>
      <input
        type="text"
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
      <button onClick={handleSave}>Guardar</button>
    </div>
  ) : (
    <p>Cargando tarea...</p>
  );
}

export default EditarTarea;
