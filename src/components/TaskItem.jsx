import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask, addSubTask, updateSubTask, deleteSubTask } from '../features/tasks/taskSlice.js';

const TaskItem = ({ task }) => {
  const [subTaskText, setSubTaskText] = useState('');
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    dispatch(updateTask({ taskId: task._id, taskData: { status: e.target.value } }));
  };

  const handleSubTaskSubmit = (e) => {
    e.preventDefault();
    if (!subTaskText) return;
    dispatch(addSubTask({ taskId: task._id, subTaskData: { text: subTaskText } }));
    setSubTaskText('');
  };

  return (
    <div className='task'>
      <div className='task-header'>
        <div>
          <small>Created: {new Date(task.createdAt).toLocaleDateString('en-US')}</small>
          {task.dueDate && <small> | Due: {new Date(task.dueDate).toLocaleDateString('en-US')}</small>}
        </div>
        <button onClick={() => dispatch(deleteTask(task._id))} className='close'>X</button>
      </div>
      
      <h2>{task.title}</h2>
      {task.description && <p>{task.description}</p>}

      <div className='task-meta'>
        <span className={`priority priority-${task.priority?.toLowerCase()}`}>{task.priority}</span>
        <select value={task.status} onChange={handleStatusChange} className='status-select'>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className='subtasks-section'>
        <h4>Checklist</h4>
        {task.subTasks?.map((subTask) => (
          <div key={subTask._id} className='subtask-item'>
            <input
              type="checkbox"
              checked={subTask.completed}
              onChange={(e) => dispatch(updateSubTask({
                taskId: task._id,
                subTaskId: subTask._id,
                subTaskData: { completed: e.target.checked }
              }))}
            />
            <span className={subTask.completed ? 'completed' : ''}>{subTask.text}</span>
            <button
              onClick={() => dispatch(deleteSubTask({ taskId: task._id, subTaskId: subTask._id }))}
              className="delete-subtask"
            >
              &times;
            </button>
          </div>
        ))}
        <form onSubmit={handleSubTaskSubmit} className='subtask-form'>
          <input
            type="text"
            placeholder="Add a new sub-task..."
            value={subTaskText}
            onChange={(e) => setSubTaskText(e.target.value)}
          />
          <button type="submit">+</button>
        </form>
      </div>

      {task.tags?.length > 0 && (
        <div className='tags-section'>
          {task.tags.map((tag, index) => <span key={index} className='tag'>{tag}</span>)}
        </div>
      )}
    </div>
  );
};

export default TaskItem;