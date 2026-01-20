import React, { useState } from 'react';
import { api } from '../api/api';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

const CreateIdea = ({ onIdeaCreated }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        impacted_users: 0,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createIdea(formData);
            setFormData({ id: '', title: '', description: '', impacted_users: 0 });
            if (onIdeaCreated) onIdeaCreated();
        } catch (error) {
            console.error("Failed to create idea", error);
            alert("Error creating idea");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card animate-fade-in">
            <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Submit New Idea</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Idea ID</label>
                    <input
                        type="text"
                        required
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        placeholder="e.g. IDEA-001"
                    />
                </div>
                <div className="form-group">
                    <label>Idea Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Dark Mode Support"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows="3"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the feature..."
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Impacted Users (Est.)</label>
                    <input
                        type="number"
                        required
                        value={formData.impacted_users}
                        onChange={(e) => setFormData({ ...formData, impacted_users: parseInt(e.target.value) || 0 })}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                        *Automated Triage: &gt; 100 users required for validation.
                    </small>
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    {loading ? <FaSpinner className="spin" /> : <><FaPaperPlane /> Submit Idea</>}
                </button>
            </form>
        </div>
    );
};

export default CreateIdea;
