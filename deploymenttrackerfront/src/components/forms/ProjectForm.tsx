import React from 'react';

const ProjectForm = ({ project, onProjectChange, onSubmit, onCancel }) => {
  console.log('ProjectForm rendering', { project });
  
  return (
    <div>
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={project.name}
        onChange={(e) => onProjectChange({ ...project, name: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 mb-3"
      />
      <textarea
        placeholder="Descripción"
        value={project.description}
        onChange={(e) => onProjectChange({ ...project, description: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 mb-4 h-20 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          Crear
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;