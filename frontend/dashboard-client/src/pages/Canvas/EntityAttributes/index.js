import React from 'react';

const keys = [
	['registered_in', 'Registered In'],
	['dateOfBirth', 'Date of Birth'],
	['gender', 'Gender'],
	['titles', 'Title'],
	['place_of_birth', 'Place of Birth'],
	['last_seen', 'Last Seen'],
	['incorporation_date', 'Incorporation Date']
];

export default (node) => {
	return (
		<div>
			{ keys.map(k => {
		        const val = node[k[0]];
		        if (node[k[0]]) {
		          return (
		            <div className="info-row" key={k}>
		              <p className="info-key">{k[1]}:</p>
		              {(!(val instanceof Array))
		                ? <p className="info-value">{val}</p>
		                : <p>list</p>
		              }
		            </div>
		          )
		        }
		    }) }
		</div>
	);
}
