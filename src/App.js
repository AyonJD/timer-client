import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [classes, setClasses] = useState([]);
  const [lastUnlocked, setLastUnlocked] = useState(0);

  const getClasses = async () => {
    const response = await fetch('http://localhost:5000/classes');
    const data = await response.json();
    setClasses(data);
  };
  useEffect(() => {
    getClasses();
  }, []);

  //put is_unlock = true in every class after 24 hours


  useEffect(() => {
    const lastUnlocked = classes
      .map((item, index) => (item.is_unlock === true ? index : null))
      .filter((item) => item !== null)
      .pop()

    setLastUnlocked(lastUnlocked);
  }, [lastUnlocked, classes]);

  const updateClasses = async () => {
    if (lastUnlocked) {
      const classToUnlock = classes[lastUnlocked + 1];

      const response = await fetch(`http://localhost:5000/classes/${classToUnlock._id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ is_unlock: true }),
      });
      const data = await response.json();
    }







    // const response = await fetch('http://localhost:5000/classes', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(classes),
    // });
    // const data = await response.json();
    // setClasses(data);
  };
  if (lastUnlocked) {
    setTimeout(() => {
      updateClasses();
    }
      , 1000 * 60 * 60 * 24);
  }

  var time_start = new Date();
  var time_end = new Date();
  var tomorrow_date = (time_start.getDate() + 1) + "-" + (time_start.getMonth() + 1) + "-" + time_start.getFullYear();
  var value_start = "10:00:00".split(':');
  var value_end = "10:00:00".split(':');

  time_start.setHours(value_start[0], value_start[1], value_start[2], 0)
  time_end.setHours(value_end[0], value_end[1], value_end[2], 0)

  console.log(tomorrow_date)

  // console.log(classes[lastUnlocked + 1]);
  return (
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
                          console.log('clicked');
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
  );
}

export default App;
