import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toString().toUpperCase();

  let badgeClass = 'badge-info';

  if (['PRESENT', 'APPROVED', 'VERIFIED'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['PENDING', 'HALF_DAY'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['ABSENT', 'REJECTED', 'UNPAID'].includes(normalized)) {
    badgeClass = 'badge-danger';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {normalized}
    </span>
  );
};

export default StatusBadge;
