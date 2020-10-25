import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = (props) => {
 
  return(
    <div className="grid-33">
      <Link className="course--module course--link" to={`/courses/${props.id}`}>
        <h3 className="course--label">Course</h3>
        <h3 className="course--title">{props.title}</h3>
      </Link>
    </div>
  );
}

export default CourseCard;