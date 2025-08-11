const API_BASE_URL = 'http://localhost:5239/api';

const projectsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Error fetching projects');
    return response.json();
  },

  create: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!response.ok) throw new Error('Error creating project');
    return response.json();
  },

  delete: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error deleting project');
    return response.json();
  }
};

export { projectsApi };