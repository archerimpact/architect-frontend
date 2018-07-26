import React from "react";

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
    let empty = true;
    const ret = (<div>
        { keys.filter(k => args.node[k[0]]).map(k => {
            let n = args.node;
            const val = n[k[0]];
            empty = false;
            return (
                <div className="info-row" key={k}>
                    <p className="info-key">{k[1]}</p>
                    { (!(val instanceof Array))
                        ? <p className="info-value">{val}</p>
                        : <ul className="info-value-list"> {val.map(v => <li className="info-value">{v}</li>)} </ul>
                    }
                </div>
            )
        }) }
    </div>);

    if (empty) {
        return null;
    }
    else {
        return ret;
    }
}