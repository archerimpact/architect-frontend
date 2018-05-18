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

export default (args) => {
	return (
		<div>
			{ keys.map(k => {
				let n = args.node;
		        const val = n[k[0]];
		        if (val) {
		          return (
		            <div className="info-row" key={k}>
		              <p className="info-key">{k[1]}:</p>
		              { (!(val instanceof Array))
		                  ? <p className="info-value">{val}</p>
		                  : <div className="info-value-list"> {val.map(v => <div className="info-value">{v}</div>)} </div>
		              }
		            </div>
		          )
		        }
		    }) }
		</div>
	);
}
