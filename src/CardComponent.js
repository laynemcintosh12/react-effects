import React from 'react';

const CardComponent = ({ name, image}) => {
    return <img
      className="CardComponent"
      alt={name}
      src={image}/>;
}

export default CardComponent;