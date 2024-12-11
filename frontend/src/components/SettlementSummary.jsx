import React, { useEffect, useState } from 'react';

function SettlementSummary({ groupId }) {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    fetch(`/api/settlements/${groupId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => setSettlements(data))
      .catch(err => console.error(err));
  }, [groupId]);

  return (
    <div>
      <h3>Final Settlements</h3>
      <ul>
        {settlements.map((s, i) => (
          <li key={i}>{s.fromUserName} owes {s.toUserName} {s.amount} EUR (Bank: {s.toUserBank})</li>
        ))}
      </ul>
    </div>
  );
}

export default SettlementSummary;