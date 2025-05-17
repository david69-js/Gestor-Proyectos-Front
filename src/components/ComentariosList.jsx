function ComentariosList({ comentarios }) {
  console.log('ComentariosList:', comentarios);

    if (!comentarios || comentarios.length === 0) {
      return <p className="text-muted">No hay comentarios aún.</p>;
    }
    return (

      
      <div className="comentarios-list">

        <hr class="separator"/>
        <h2>Comentarios</h2>
        {comentarios.map((comentario) => (
          <div key={comentario.id} className="comentario border p-2 mb-2">
            <p idusuario="usuario_id"><strong>{comentario.usuario_nombre}</strong></p>
            <div dangerouslySetInnerHTML={{ __html: comentario.comentario }}></div>
            <small className="text-muted">
              {new Date(comentario.fecha_comentario).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    );
  }
  
  export default ComentariosList;
  