function ComentariosList({ comentarios }) {
    if (!comentarios || comentarios.length === 0) {
      return <p className="text-muted">No hay comentarios aún.</p>;
    }
    return (
      <div className="comentarios-list">
        {comentarios.map((comentario) => (
          <div key={comentario.comentario_id} className="comentario border p-2 mb-2">
            <p idusuario="usuario_id"><strong>{comentario.usuario_nombre}</strong></p>
            <div dangerouslySetInnerHTML={{ __html: comentario.comentario_texto }}></div>
            <small className="text-muted">
              {new Date(comentario.comentario_fecha).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    );
  }
  
  export default ComentariosList;
  