import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectImage } from '../portfolio/PortfolioData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('admin_authenticated') === 'true'
  );
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // CRUD States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('React JS');
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [imageType, setImageType] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch projects list
  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid passcode. Try "admin".');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // Open Modal for Create
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentProjectId(null);
    setTitle('');
    setDesc('');
    setCategory('React JS');
    setUrl('');
    setCode('');
    setImageType('file');
    setImageUrl('');
    setImageFile(null);
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (project) => {
    setIsEditMode(true);
    setCurrentProjectId(project.id);
    setTitle(project.title || '');
    setDesc(project.desc || '');
    setCategory(project.category || 'React JS');
    setUrl(project.url || '');
    setCode(project.code || '');
    if (project.image && (project.image.startsWith('/uploads/') || project.image.startsWith('http') || project.image.startsWith('data:'))) {
      setImageType(project.image.startsWith('/uploads/') ? 'file' : 'url');
      if (project.image.startsWith('/uploads/')) {
        setImageUrl('');
      } else {
        setImageUrl(project.image);
      }
    } else {
      setImageType('url');
      setImageUrl(project.image || '');
    }
    setImageFile(null);
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  // Form Submit (Create / Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('category', category);
    formData.append('url', url);
    formData.append('code', code);

    if (imageType === 'file') {
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (isEditMode) {
        // Keep the old image
      } else {
        setErrorMsg('Please select an image file to upload.');
        return;
      }
    } else {
      formData.append('image', imageUrl);
    }

    const apiUrl = isEditMode ? `/api/projects/${currentProjectId}` : '/api/projects';
    const method = isEditMode ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method: method,
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Operation failed');
        return res.json();
      })
      .then((data) => {
        setSuccessMsg(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
        fetchProjects();
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('An error occurred. Make sure your server is running.');
      });
  };

  // Delete project
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;

    fetch(`/api/projects/${projectToDelete.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => {
        fetchProjects();
        setShowDeleteModal(false);
        setProjectToDelete(null);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to delete project. Make sure server is running.');
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="login-card">
          <div className="login-header">
            <i className="bx bxs-lock-open-alt login-icon animate-pulse"></i>
            <h2>Admin Login</h2>
            <p>Enter your passcode to manage your projects</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              placeholder="Admin Passcode (default: admin)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="login-input"
              required
            />
            {loginError && <p className="login-error-text">{loginError}</p>}
            <button type="submit" className="login-button button">
              Unlock Dashboard <i className="bx bx-right-arrow-alt button__icon"></i>
            </button>
          </form>
          <button onClick={() => navigate('/')} className="back-link">
            <i className="bx bx-left-arrow-alt"></i> Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar / Navbar */}
      <header className="admin-header">
        <div className="admin-header-container container">
          <div className="admin-logo-group">
            <i className="bx bxs-dashboard admin-logo-icon"></i>
            <h1>Admin Panel</h1>
          </div>
          <div className="admin-actions">
            <button onClick={() => navigate('/')} className="admin-nav-btn">
              <i className="bx bx-home-alt"></i> View Site
            </button>
            <button onClick={handleLogout} className="admin-logout-btn">
              <i className="bx bx-log-out"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Projects</h3>
            <p className="summary-count">{projects.length}</p>
          </div>
          <div className="summary-welcome">
            <h2>Welcome Back, Temi!</h2>
            <p>Here you can upload new projects or edit existing ones. Changes persist dynamically.</p>
            <button onClick={handleOpenCreate} className="button add-project-btn">
              <i className="bx bx-plus"></i> Add New Project
            </button>
          </div>
        </div>

        {/* Projects List Section */}
        <section className="projects-list-section">
          <h2>Projects List</h2>
          {loading ? (
            <div className="dashboard-loading">
              <i className="bx bx-loader-alt bx-spin"></i> Loading dashboard items...
            </div>
          ) : projects.length === 0 ? (
            <div className="no-projects-dashboard">
              <p>No projects found. Click "Add New Project" to get started!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Live Demo</th>
                    <th>GitHub</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <img
                          src={getProjectImage(project.image)}
                          alt=""
                          className="table-img-preview"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="table-project-title">{project.title}</td>
                      <td>
                        <span className="table-category-badge">{project.category}</span>
                      </td>
                      <td>
                        {project.url ? (
                          <a href={project.url} target="_blank" rel="noreferrer" className="table-link">
                            Demo <i className="bx bx-link-external"></i>
                          </a>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        {project.code ? (
                          <a href={project.code} target="_blank" rel="noreferrer" className="table-link">
                            GitHub <i className="bx bxl-github"></i>
                          </a>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="btn-edit"
                            title="Edit Project"
                          >
                            <i className="bx bx-edit-alt"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project)}
                            className="btn-delete"
                            title="Delete Project"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">
                <i className="bx bx-x"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {errorMsg && <div className="modal-alert error-alert">{errorMsg}</div>}
              {successMsg && <div className="modal-alert success-alert">{successMsg}</div>}

              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Tell us about the project features, tech stack, and goals..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="React JS">React JS</option>
                    <option value="Vue JS">Vue JS</option>
                    <option value="PHP">PHP</option>
                    <option value="HTML/CSS">HTML/CSS</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Demo Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>GitHub Code Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={imageType === 'file'}
                      onChange={() => setImageType('file')}
                    />
                    Upload Image
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === 'url'}
                      onChange={() => setImageType('url')}
                    />
                    External Image URL or Placeholder Key
                  </label>
                </div>
              </div>

              {imageType === 'file' ? (
                <div className="form-group">
                  <label>Choose Image File {!isEditMode && '*'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required={!isEditMode}
                    className="file-input"
                  />
                  {isEditMode && <p className="input-hint">Leave empty to keep the existing image.</p>}
                </div>
              ) : (
                <div className="form-group">
                  <label>Image URL / Static Key *</label>
                  <input
                    type="text"
                    placeholder="e.g. tracechain, itask, or https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit button">
                  {isEditMode ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close-btn">
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="modal-form" style={{ gap: '1rem', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#f87171', marginBottom: '0.5rem' }}>
                <i className="bx bx-error-circle"></i>
              </div>
              <p style={{ fontSize: '0.938rem', color: '#fff', lineHeight: '1.5' }}>
                Are you sure you want to delete <strong>"{projectToDelete.title}"</strong>?
              </p>
              <p style={{ fontSize: '0.813rem', color: '#94a3b8', lineHeight: '1.4' }}>
                This action is permanent and cannot be undone.
              </p>
              
              <div className="modal-actions" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
                <button type="button" onClick={() => setShowDeleteModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDelete} 
                  className="button"
                  style={{ background: '#ef4444', color: '#fff', border: 'none', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
