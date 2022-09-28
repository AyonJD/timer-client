import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [classes, setClasses] = useState([]);

  const getClasses = async () => {
    const response = await fetch('http://localhost:5000/classes');
    const data = await response.json();
    setClasses(data);
  };
  useEffect(() => {
    getClasses();
  }, []);

  console.log(classes);
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
