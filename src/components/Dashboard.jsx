import { useSelector } from 'react-redux';
import TaskForm from './TaskForm.jsx';
import TaskList from './TaskList.jsx';
import Spinner from './Spinner.jsx';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  
  // Handle the initial authentication loading state here
  if (authLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user?.name}</h1>
        <p>Your Personal Task Dashboard</p>
      </section>

      <TaskForm />
      <TaskList /> 
    </>
  );
};

export default Dashboard;