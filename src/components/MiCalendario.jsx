import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './Calendario.css';  


function MiCalendario() {
  const [fecha, setFecha] = useState(new Date());

  return (
    <div>
      <Calendar onChange={setFecha} value={fecha} />
    </div>
  );
}

export default MiCalendario;
