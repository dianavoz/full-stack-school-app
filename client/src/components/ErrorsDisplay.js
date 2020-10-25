import React from 'react';

// It renders any validation errors sent from the API
export default (props) => {
	const {
		errors,
	} = props;

  	return (
		<div>
			<ErrorsDisplay errors={errors} />
		</div>
  	);
}

function ErrorsDisplay({ errors }) {
  	let errorsDisplay = null;

	if (errors.length) {
		errorsDisplay = (
			<div>
				<h2 className="validation--errors--label">Validation Errors</h2>
				<div className="validation-errors">
					<ul>
						{errors.map((error, i) => <li key={i}>{error}</li>)}
					</ul>
				</div>
			</div>
		);
	}

  	return errorsDisplay;
}
