import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SettlementSummary from '../components/SettlementSummary';

function SettlementPage() {
  const { groupId } = useParams();

  return (
    <div>
      <Header />
      <h1>Settlement for Group {groupId}</h1>
      <SettlementSummary groupId={groupId} />
    </div>
  );
}

export default SettlementPage;