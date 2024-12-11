import React, { useEffect, useState } from 'react';

function GroupList() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('/api/groups', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming user token stored in localStorage
      }
    })
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Your Groups</h2>
      <ul>
        {groups.map(g => (
          <li key={g.id}>
            {g.name} - <a href={`/groups/${g.id}/expenses`}>View Expenses</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;