import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks } from '../features/tasks/taskSlice.js';
import { toast } from 'react-toastify';
import TaskItem from './TaskItem.jsx';
import Spinner from './Spinner.jsx';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  useEffect(() => {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    dispatch(getTasks(filterData));
    
  // --- THE FIX IS HERE ---
  // We now depend on the primitive values inside the filters object, not the object itself.
  }, [dispatch, filters.status, filters.priority, sortBy]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleFilterChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='filters'>
        <h3>Filter & Sort Tasks</h3>
        <div className='filter-controls'>
          {/* ... your JSX for filter controls ... */}
          <div className='form-group'>
            <label htmlFor='status'>Status</label>
            <select name='status' onChange={handleFilterChange} value={filters.status}>
              <option value=''>All</option>
              <option value='To Do'>To Do</option>
              <option value='In Progress'>In Progress</option>
              <option value='Done'>Done</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='priority'>Priority</label>
            <select name='priority' onChange={handleFilterChange} value={filters.priority}>
              <option value=''>All</option>
              <option value='Low'>Low</option>
              <option value='Medium'>Medium</option>
              <option value='High'>High</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='sortBy'>Sort By</label>
            <select name='sortBy' onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value='createdAt:desc'>Newest First</option>
              <option value='createdAt:asc'>Oldest First</option>
              <option value='dueDate:asc'>Due Date</option>
              <option value='priority'>Priority</option>
            </select>
          </div>
        </div>
      </section>

      <section className='content'>
        {tasks.length > 0 ? (
          <div className='tasks'>
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <h3>No tasks match your current filters</h3>
        )}
      </section>
    </>
  );
};

export default TaskList;