import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  // TODO: Add auth checks if needed
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/groups" style={{ marginRight: '10px' }}>Groups</Link>
    </header>
  );
}

export default Header;