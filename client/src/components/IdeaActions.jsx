import React, { useState } from 'react';
import { api } from '../api/api';

const IdeaActions = ({ idea, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const handleAction = async (actionType) => {
        setLoading(true);
        try {
            if (actionType === 'evaluate') {
                const approved = confirm("Approve this idea as worth pursuing?");
                await api.evaluateIdea(idea.id, {
                    evaluator_comments: prompt("Evaluator Comments:") || "Evaluated",
                    approved
                });
            } else if (actionType === 'budget') {
                const budget = parseFloat(prompt("Enter Budget Allocation ($):"));
                if (isNaN(budget)) return;
                await api.approveBudget(idea.id, { budget, leadership_approval: true });
            } else if (actionType === 'estimate') {
                const estimate = prompt("Enter Development Effort Estimate (e.g. 2 weeks, 5 Sprints):");
                if (!estimate) return;
                await api.estimateEffort(idea.id, { dev_effort_estimate: estimate });
            } else if (actionType === 'schedule') {
                const start = prompt("Start Date (YYYY-MM-DD):");
                const end = prompt("End Date (YYYY-MM-DD):");
                if (!start || !end) return;
                await api.scheduleIdea(idea.id, { start_date: start, end_date: end });
            } else if (actionType === 'golive') {
                if (confirm("Confirm Go Live?")) {
                    await api.goLive(idea.id);
                }
            }
            onUpdate();
        } catch (e) {
            console.error(e);
            alert("Action failed");
        } finally {
            setLoading(false);
        }
    };

    if (idea.status === 'Archived') return null;

    return (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {idea.status === 'Valid' && (
                <button onClick={() => handleAction('evaluate')} className="btn-secondary">Evaluate</button>
            )}
            {idea.status === 'Evaluated' && (
                <button onClick={() => handleAction('budget')} className="btn-secondary">Approve Budget</button>
            )}
            {idea.status === 'Budgeted' && (
                <button onClick={() => handleAction('estimate')} className="btn-secondary">Estimate Effort</button>
            )}
            {idea.status === 'In Development' && (
                <button onClick={() => handleAction('schedule')} className="btn-secondary">Set Schedule</button>
            )}
            {idea.status === 'Scheduled' && (
                <button onClick={() => handleAction('golive')} className="btn-primary">Go Live</button>
            )}
        </div>
    );
};

export default IdeaActions;
