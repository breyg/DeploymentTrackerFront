import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, Plus, Edit, Eye, Trash2, X, Check, Settings } from 'lucide-react';

const DeploymentDashboard = () => {
  const [expandedProjects, setExpandedProjects] = useState({});
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showEditComponent, setShowEditComponent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditChecklist, setShowEditChecklist] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  // FUNCIONES PARA PROYECTOS
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

  const editProject = async () => {
    if (!editingProject?.name.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProject.name,
          description: editingProject.description
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
      setShowEditProject(false);
    } catch (err) {
      setError(`Error updating project: ${err.message}`);
      console.error('Error updating project:', err);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setProjects(projects.filter(p => p.id !== projectId));
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(`Error deleting project: ${err.message}`);
      console.error('Error deleting project:', err);
    }
  };

  // FUNCIONES PARA COMPONENTES
  const editComponent = async () => {
    if (!editingComponent?.name.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/components/${editingComponent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingComponent.name,
          type: editingComponent.type,
          jiraTicket: editingComponent.jiraTicket
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

													 
	  
      // Recargar proyectos para obtener los datos actualizados
      await fetchProjects();
				   
													
																   
		 
		   
      
      setEditingComponent(null);
      setShowEditComponent(false);
    } catch (err) {
      setError(`Error updating component: ${err.message}`);
      console.error('Error updating component:', err);
    }
  };

  const deleteComponent = async (componentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/components/${componentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Recargar proyectos para obtener los datos actualizados
      await fetchProjects();
				   
																				
																								
		   
      
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(`Error deleting component: ${err.message}`);
      console.error('Error deleting component:', err);
    }
  };

  // FUNCIONES PARA CHECKLISTS
  const toggleChecklistItem = async (componentId, itemId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checklist-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Actualizar el estado local
      setProjects(projects.map(project => ({
        ...project,
        components: project.components?.map(component => {
          if (component.id === componentId) {
            return {
              ...component,
              checklist: component.checklist?.map(item =>
                item.id === itemId 
                  ? { ...item, completed: !currentStatus }
                  : item
              )
            };
          }
          return component;
        })
      })));
    } catch (err) {
      setError(`Error updating checklist item: ${err.message}`);
      console.error('Error updating checklist item:', err);
    }
  };

  const openEditChecklist = (component) => {
    setEditingChecklist({
      componentId: component.id,
      componentName: component.name,
      items: component.checklist ? [...component.checklist] : [],
      newItem: ''
    });
    setShowEditChecklist(true);
  };

  const addChecklistItem = () => {
    if (!editingChecklist?.newItem.trim()) return;

    const newItem = {
      id: Date.now(), // Temporal ID
      item: editingChecklist.newItem,
      completed: false,
      notes: '',
      isNew: true
    };

    setEditingChecklist({
      ...editingChecklist,
      items: [...editingChecklist.items, newItem],
      newItem: ''
    });
  };

  const removeChecklistItem = (itemId) => {
    setEditingChecklist({
      ...editingChecklist,
      items: editingChecklist.items.filter(item => item.id !== itemId)
    });
  };

  const updateChecklistItem = (itemId, field, value) => {
    setEditingChecklist({
      ...editingChecklist,
      items: editingChecklist.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  const saveChecklist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/components/${editingChecklist.componentId}/checklist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: editingChecklist.items.map((item, index) => ({
            id: item.isNew ? 0 : item.id,
            description: item.item,
            isCompleted: item.completed,
            notes: item.notes || '',
            order: index + 1
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Recargar proyectos para obtener los IDs actualizados
      await fetchProjects();
      
      setEditingChecklist(null);
      setShowEditChecklist(false);
    } catch (err) {
      setError(`Error saving checklist: ${err.message}`);
      console.error('Error saving checklist:', err);
    }
  };

  // FUNCIONES DE UI
  const openEditProject = (project, e) => {
    e.stopPropagation();
    setEditingProject({ ...project });
    setShowEditProject(true);
  };

  const openEditComponent = (component, e) => {
    e.stopPropagation();
    setEditingComponent({ ...component });
    setShowEditComponent(true);
  };

  const openDeleteConfirm = (target, type, e) => {
    e.stopPropagation();
    setDeleteTarget({ ...target, type });
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (deleteTarget.type === 'project') {
      deleteProject(deleteTarget.id);
    } else if (deleteTarget.type === 'component') {
      deleteComponent(deleteTarget.id);
    }
  };

  // Función para calcular progreso del checklist
  const getChecklistProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
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

        {/* MODAL AGREGAR PROYECTO */}
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
                className="w-full border rounded-lg px-3 py-2 mb-4 h-20 resize-none"
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

        {/* MODAL EDITAR PROYECTO */}
        {showEditProject && editingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Editar Proyecto</h2>
                <button
                  onClick={() => setShowEditProject(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={editingProject.name}
                onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <textarea
                placeholder="Descripción"
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-4 h-20 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={editProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowEditProject(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR COMPONENTE */}
        {showEditComponent && editingComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Editar Componente</h2>
                <button
                  onClick={() => setShowEditComponent(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Nombre del componente"
                value={editingComponent.name}
                onChange={(e) => setEditingComponent({...editingComponent, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <select
                value={editingComponent.type || ''}
                onChange={(e) => setEditingComponent({...editingComponent, type: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              >
                <option value="">Seleccionar tipo</option>
                <option value="API">API</option>
                <option value="Frontend">Frontend</option>
                <option value="Database">Database</option>
                <option value="Service">Service</option>
                <option value="Lambda">Lambda</option>
                <option value="S3">S3</option>
                <option value="CloudFront">CloudFront</option>
              </select>
              <input
                type="text"
                placeholder="Ticket de Jira (opcional)"
                value={editingComponent.jiraTicket || ''}
                onChange={(e) => setEditingComponent({...editingComponent, jiraTicket: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={editComponent}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowEditComponent(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CONFIRMACIÓN ELIMINAR */}
        {showDeleteConfirm && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold">Confirmar Eliminación</h2>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar {deleteTarget.type === 'project' ? 'el proyecto' : 'el componente'} 
                <span className="font-semibold"> "{deleteTarget.name}"</span>?
                {deleteTarget.type === 'project' && (
                  <span className="block mt-2 text-sm text-red-600">
                    Esto también eliminará todos los componentes del proyecto.
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR CHECKLIST */}
        {showEditChecklist && editingChecklist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Editar Checklist - {editingChecklist.componentName}</h2>
                <button
                  onClick={() => setShowEditChecklist(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Agregar nuevo item */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Agregar nuevo item</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Descripción del item..."
                    value={editingChecklist.newItem}
                    onChange={(e) => setEditingChecklist({...editingChecklist, newItem: e.target.value})}
                    className="flex-1 border rounded-lg px-3 py-2"
                    onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                  />
                  <button
                    onClick={addChecklistItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de items */}
              <div className="flex-1 overflow-y-auto mb-4">
                <h3 className="font-medium mb-3">Items del checklist</h3>
                {editingChecklist.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay items en el checklist</p>
                ) : (
                  <div className="space-y-3">
                    {editingChecklist.items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => updateChecklistItem(item.id, 'item', e.target.value)}
                              className="w-full border rounded px-2 py-1 mb-2"
                              placeholder="Descripción del item..."
                            />
                            <textarea
                              value={item.notes || ''}
                              onChange={(e) => updateChecklistItem(item.id, 'notes', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-xs resize-none"
                              rows="2"
                              placeholder="Notas opcionales..."
                            />
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={(e) => updateChecklistItem(item.id, 'completed', e.target.checked)}
                                className="rounded text-blue-600"
                              />
                              Completado
                            </label>
                            <button
                              onClick={() => removeChecklistItem(item.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={saveChecklist}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setShowEditChecklist(false)}
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
                        {project.componentsCount || 0} componentes
                      </span>
                      <button
                        onClick={(e) => openEditProject(project, e)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar proyecto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => openDeleteConfirm(project, 'project', e)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => openEditComponent(component, e)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Editar componente"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => openDeleteConfirm(component, 'component', e)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Eliminar componente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditChecklist(component)}
                                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Editar checklist"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                            </div>
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
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-sm text-gray-700">Checklist de Despliegue</h4>
                                <button
                                  onClick={() => openEditChecklist(component)}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <Settings className="w-3 h-3" />
                                  Editar
                                </button>
                              </div>
                              
                              {/* Barra de progreso */}
                              {(() => {
                                const progress = getChecklistProgress(component.checklist);
                                return (
                                  <div className="mb-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                      <span>Progreso</span>
                                      <span>{progress.completed} de {progress.total} ({progress.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                          progress.percentage === 100 
                                            ? 'bg-green-500' 
                                            : progress.percentage > 50 
                                            ? 'bg-yellow-500' 
                                            : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${progress.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })()}
                              
                              {/* Lista de items del checklist */}
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {component.checklist.map(item => (
                                  <div key={item.id} className="flex items-start gap-2 group">
                                    <input
                                      type="checkbox"
                                      checked={item.completed}
                                      onChange={() => toggleChecklistItem(component.id, item.id, item.completed)}
                                      className="rounded text-blue-600 mt-0.5 cursor-pointer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <span className={`text-sm block ${item.completed ?
                                        'line-through text-gray-500' : 'text-gray-700'}`}>
                                        {item.item}
                                      </span>
                                      {item.notes && (
                                        <span className="text-xs text-gray-500 block mt-1">
                                          {item.notes}
                                        </span>
                                      )}
                                    </div>
                                    {item.completed && (
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    )}
                                  </div>
                                ))}
																																																												 
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