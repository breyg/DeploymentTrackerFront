import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, Plus, Edit, Eye } from 'lucide-react';

const DeploymentDashboard = () => {
  const [expandedProjects, setExpandedProjects] = useState({});
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de la API
  const API_BASE_URL = 'http://localhost:5239/api';

  // Cargar proyectos desde la API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'deployed': 
        return 'bg-green-100 text-green-800';
      case 'inprogress': 
      case 'in-progress': 
        return 'bg-yellow-100 text-yellow-800';
      case 'pending': 
        return 'bg-gray-100 text-gray-800';
      case 'failed': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'deployed': 
        return <CheckCircle className="w-4 h-4" />;
      case 'inprogress':
      case 'in-progress': 
        return <Clock className="w-4 h-4" />;
      case 'failed': 
        return <AlertCircle className="w-4 h-4" />;
      default: 
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'inprogress': 
        return 'in-progress';
      default: 
        return status?.toLowerCase() || 'pending';
    }
  };

  const addProject = async () => {
    if (!newProject.name.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProject.name,
          description: newProject.description
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      setNewProject({ name: '', description: '' });
      setShowAddProject(false);
    } catch (err) {
      setError(`Error creating project: ${err.message}`);
      console.error('Error creating project:', err);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error al cargar los datos:</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DeploymentTracker</h1>
          <p className="text-gray-600">Gestión de componentes AWS por ambiente</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddProject(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        </div>

        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Nuevo Proyecto</h2>
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <textarea
                placeholder="Descripción"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-4 h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={addProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Crear
                </button>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay proyectos creados aún</p>
              <button
                onClick={() => setShowAddProject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Crear primer proyecto
              </button>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border">
                <div
                  className="p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedProjects[project.id] ? 
                        <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      }
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {project.componentsCount} componentes
                      </span>
                      <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </div>
                  </div>
                </div>

                {expandedProjects[project.id] && (
                  <div className="p-4">
                    {project.components && project.components.length > 0 ? (
                      project.components.map(component => (
                        <div key={component.id} className="mb-6 last:mb-0 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium text-gray-900">{component.name}</h3>
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                {component.type}
                              </span>
                              {component.jiraTicket && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                  {component.jiraTicket}
                                </span>
                              )}
                            </div>
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-4">
                            {['dev', 'qa', 'uat', 'prod'].map(env => {
                              const version = component.versions && component.versions[env];
                              return (
                                <div key={env} className="border rounded-lg p-3 bg-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm text-gray-700 uppercase">{env}</h4>
                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(version?.status)}`}>
                                      {getStatusIcon(version?.status)}
                                      {formatStatusText(version?.status)}
                                    </div>
                                  </div>
                                  <p className="text-sm font-mono text-gray-600">
                                    {version?.version || 'No deployed'}
                                  </p>
                                  {version?.lastDeploy && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {version.lastDeploy}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {component.checklist && component.checklist.length > 0 && (
                            <div className="border rounded-lg p-3 bg-white">
                              <h4 className="font-medium text-sm text-gray-700 mb-2">Checklist de Despliegue</h4>
                              <div className="space-y-2">
                                {component.checklist.map(item => (
                                  <div key={item.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={item.completed}
                                      readOnly
                                      className="rounded text-blue-600"
                                    />
                                    <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                      {item.item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                {component.checklist.filter(i => i.completed).length} de {component.checklist.length} completados
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No hay componentes en este proyecto</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;