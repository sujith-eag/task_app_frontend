import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from '../features/tasks/taskSlice.js';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    tags: '',
  });

  const { title, description, dueDate, priority, tags } = formData;
  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      // Convert comma-separated string to an array of strings
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    dispatch(createTask(taskData));

    // Reset form to initial state
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      tags: '',
    });
  };

  return (
    <section className="form">
      <h3>Create a New Task</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor='title'>Title</label>
          <input type="text" name="title" id="title" value={title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor='description'>Description</label>
          <textarea name="description" id="description" value={description} onChange={onChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor='dueDate'>Due Date</label>
          <input type="date" name="dueDate" id="dueDate" value={dueDate} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor='priority'>Priority</label>
          <select name="priority" id="priority" value={priority} onChange={onChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='tags'>Tags (comma-separated)</label>
          <input type="text" name="tags" id="tags" value={tags} onChange={onChange} />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">Add Task</button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
