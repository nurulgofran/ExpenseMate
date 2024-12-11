import React from 'react';
import Header from '../components/Header';
import GroupList from '../components/GroupList';

function GroupsPage() {
  // Could add a form to create a new group
  return (
    <div>
      <Header />
      <GroupList />
    </div>
  );
}

export default GroupsPage;