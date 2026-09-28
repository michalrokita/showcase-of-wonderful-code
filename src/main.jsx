import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const starterTasks = [
  { id: 1, title: 'Review project brief', tag: 'Work', done: true },
  { id: 2, title: 'Plan tomorrow’s priorities', tag: 'Personal', done: false },
  { id: 3, title: 'Reply to outstanding emails', tag: 'Work', done: false },
  { id: 4, title: 'Take a walk outside', tag: 'Wellness', done: false },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('daymark-tasks')) || starterTasks; }
    catch { return starterTasks; }
  });
  const [filter, setFilter] = useState('All');
  const [draft, setDraft] = useState('');

  useEffect(() => localStorage.setItem('daymark-tasks', JSON.stringify(tasks)), [tasks]);

  const active = tasks.filter((task) => !task.done).length;
  const completed = tasks.length - active;
  const visibleTasks = useMemo(() => tasks.filter((task) => filter === 'All' || (filter === 'Active' ? !task.done : task.done)), [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTasks([{ id: Date.now(), title, tag: 'Personal', done: false }, ...tasks]);
    setDraft('');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>daymark</span></div>
        <div className="profile"><div className="avatar">MR</div><div><strong>Good morning, Michal</strong><span>Let’s get things done.</span></div></div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#tasks"><span>☷</span> My tasks <b>{active}</b></a>
          <a className="nav-item" href="#today"><span>◷</span> Today</a>
          <a className="nav-item" href="#completed"><span>✓</span> Completed</a>
        </nav>
        <div className="sidebar-bottom"><div className="focus-card"><span className="focus-icon">◒</span><strong>Stay focused</strong><p>Small progress is still progress.</p></div><span className="version">DAYMARK · 01</span></div>
      </aside>

      <main className="main-content" id="tasks">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><i>/</i><strong>My tasks</strong></div><button className="icon-button" aria-label="Notifications">♧<span className="notification-dot" /></button></header>
        <section className="hero"><div><p className="eyebrow">MONDAY, JUNE 24, 2024</p><h1>Make today count<span>.</span></h1><p className="subtitle">A clear mind starts with a clear list.</p></div><div className="progress-ring" aria-label={`${completed} of ${tasks.length} tasks completed`}><strong>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</strong><span>complete</span></div></section>

        <section className="task-card">
          <div className="card-header"><div><h2>Your tasks</h2><p>{active ? `${active} task${active === 1 ? '' : 's'} left to finish` : 'Everything is checked off'}</p></div><div className="filter-tabs" role="tablist" aria-label="Task filters">{['All', 'Active', 'Completed'].map((name) => <button key={name} className={filter === name ? 'selected' : ''} onClick={() => setFilter(name)} role="tab" aria-selected={filter === name}>{name}<span>{name === 'All' ? tasks.length : name === 'Active' ? active : completed}</span></button>)}</div></div>
          <form className="add-task" onSubmit={addTask}><span>＋</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a new task..." aria-label="New task" /><button type="submit">Add task</button></form>
          <div className="task-list">{visibleTasks.length ? visibleTasks.map((task) => <article className={`task-row ${task.done ? 'completed' : ''}`} key={task.id}><button className="check-button" onClick={() => setTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} aria-label={`${task.done ? 'Mark incomplete' : 'Complete'} ${task.title}`}>{task.done ? '✓' : ''}</button><div className="task-copy"><span>{task.title}</span><small className={`tag ${task.tag.toLowerCase()}`}>{task.tag}</small></div><button className="delete-button" onClick={() => setTasks(tasks.filter((item) => item.id !== task.id))} aria-label={`Delete ${task.title}`}>×</button></article>) : <div className="empty-state"><span>✦</span><strong>{filter === 'Completed' ? 'No completed tasks yet' : 'You’re all caught up!'}</strong><p>{filter === 'Completed' ? 'Finish a task and it will appear here.' : 'Enjoy the space, or add something new above.'}</p></div>}</div>
          <div className="card-footer"><span><span className="tiny-dot" /> Saved automatically</span>{tasks.length > 0 && <button onClick={() => setTasks([])}>Clear all tasks</button>}</div>
        </section>
        <footer className="main-footer"><span>© 2024 Daymark</span><span>Built for better days <b>♥</b></span></footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
