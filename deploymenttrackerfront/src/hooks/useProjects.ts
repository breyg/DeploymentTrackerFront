// @ts-nocheck
import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      setLoading(true);
      setError(null);
      
      const data = await projectsApi.getAll();
      console.log('Projects fetched:', data.length);
      
      setProjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      const newProject = await projectsApi.create(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError('Error creating project');
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await projectsApi.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Error deleting project');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    addProject,
    deleteProject,
    refetch: fetchProjects
  };
};

export default useProjects;