import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import IdeaActions from './IdeaActions';
import { FaTrash } from 'react-icons/fa';

const IdeaList = ({ refreshTrigger }) => {
    const [ideas, setIdeas] = useState([]);

    const fetchIdeas = async () => {
        try {
            const res = await api.getIdeas();
            setIdeas(res.data.data);
        } catch (error) {
            console.error("Error fetching ideas", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this idea?")) {
            try {
                await api.deleteIdea(id);
                fetchIdeas();
            } catch (error) {
                console.error("Error deleting idea", error);
                alert("Failed to delete idea");
            }
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, [refreshTrigger]);

    const statusColor = (status) => {
        return `status-${status.replace(/\s+/g, '').toLowerCase()}`;
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Idea Pipeline</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {ideas.map((idea) => (
                    <div key={idea.id} className="glass-card animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#c7d2fe', background: 'rgba(99, 102, 241, 0.2)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>ID: {idea.id}</span>
                                <span className={`status-badge ${statusColor(idea.status)}`}>{idea.status}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(idea.created_at).toLocaleDateString()}</span>
                                <button onClick={() => handleDelete(idea.id)} style={{ background: 'none', padding: 0, color: 'var(--danger)', opacity: 0.7, cursor: 'pointer', border: 'none' }} title="Delete Idea">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{idea.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{idea.description}</p>

                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            <strong>Impact:</strong> {idea.impacted_users} Users
                        </div>

                        {idea.budget > 0 && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                                <strong>Budget:</strong> ${idea.budget}
                            </div>
                        )}

                        {idea.start_date && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Schedule: {idea.start_date} to {idea.end_date}
                            </div>
                        )}

                        <IdeaActions idea={idea} onUpdate={fetchIdeas} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IdeaList;
