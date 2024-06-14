import React from 'react';

const Errors = ({ errors }) => {
  return (
    <div className="alert alert-danger mt-3 mb-0">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {errors.map((error) => (
          <li key={error.message}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Errors;
