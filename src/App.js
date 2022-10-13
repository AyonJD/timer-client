import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [classes, setClasses] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [lastUnlocked, setLastUnlocked] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const getClasses = async () => {
    const response = await fetch('http://localhost:5000/classes');
    const data = await response.json();
    setClasses(data);
  };
  useEffect(() => {
    getClasses();
  }, [refetch]);

  //put is_unlock = true in every class after 24 hours


  useEffect(() => {
    const lastUnlocked = classes
      .map((item, index) => (item.is_unlock === true ? index : null))
      .filter((item) => item !== null)
      .pop()

    setLastUnlocked(lastUnlocked);
  }, [lastUnlocked, classes]);


  const updateClasses = async () => {

    const classToUnlock = classes[lastUnlocked + 1];

    const response = await fetch(`http://localhost:5000/classes/${classToUnlock._id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ is_unlock: true }),
    });
    const data = await response.json();
    console.log(data);
    if (data.status === 200) {
      toast.success(data.message, {
        id: 'unlocked',
      });
    }
    return;
  };

  const runOneTime = () => {
    let exicuted = false;
    if (!exicuted) {
      setTimeout(() => {
        updateClasses();
      }
        , 86400000);
      exicuted = true;
    }
  };

  useEffect(() => {
    if ((lastUnlocked || lastUnlocked === 0) && time === '10:00:00 PM') {
      runOneTime();
      setRefetch(!refetch);
    }
  });

  const handleComplete = async (id) => {
    const response = await fetch(`http://localhost:5000/classes?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ is_complete: true }),
    });
    const data = await response.json();
    if (data.result === 'success') {
      toast.success('Class completed', {
        id: 'completed',
      });
      setRefetch(!refetch);
    }
  }

  return (
    <>
      <div className='container mx-auto my-10'>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-400">
            <thead class="text-xs bg-black uppercasebg-gray-700 text-gray-400">
              <tr>
                <th scope="col" class="py-3 px-6 rounded-tl-lg">
                  Serial
                </th>
                <th scope="col" class="py-3 px-6">Module</th>
                <th scope="col" class="py-3 px-6">Lock</th>
                <th scope="col" class="py-3 px-6">Status</th>
                <th scope="col" class="py-3 px-6 rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                classes.map((item, index) => {
                  return (
                    <tr key={index} class="bg-gray-800">
                      <td class="py-4 px-6">{index + 1}</td>
                      <td class="py-4 px-6">{item.name}</td>
                      <td class="py-4 px-6">{item.is_unlock ? "Unlocked" : "Locked"}</td>
                      <td class="py-4 px-6">{item.is_complete ? "Complete" : "Not complete"}</td>
                      <td class="py-4 px-6">
                        <button
                          disabled={!item.is_unlock}
                          onClick={() => {
                            handleComplete(item._id);
                          }}
                          className={`btn btn-xs border border-green-400 px-4 py-1  rounded-md ${item.is_unlock ? "bg-transparent text-green-400 cursor-pointer hover:bg-green-400 hover:text-white transition-all delay-100" : "bg-gray-400 text-white"}`}>Next</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
