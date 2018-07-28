import React, {Component} from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import {connect} from "react-redux";

import './style.css';

class DocumentDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
              <div className="title">
                Lebanon-Based SSRC Procurement Network: Electronics Katrangi Trading (EKT)
              </div>
              <div className="paragraph">
                OFAC is designating, pursuant to E.O. 13382, EKT and its network, which has provided, or attempted to provide, financial, material, technological, or other support for, or goods or services in support of, the SSRC.  EKT is an electronics supplier based in Lebanon with operations in Syria, Egypt, China, and France, and is a leading supplier for the SSRC—including goods used in the production of weapons of mass destruction.  EKT uses various aliases and numerous branches to conduct its activities, including Electronic Systems Group (ESG), NKtronics, Smart Pegasus, Lumière Elysées, Smart Green Power, and Al Amir Electronics.
              </div>
              <div className="paragraph">
                Amir Katrangi, Maher Katrangi, Houssam Katrangi, Mohamad Katrangi, Mireille Chahine, and EKT Smart Technology are being designated for acting or purporting to act for or on behalf of, directly or indirectly, EKT.  Amir, Maher, and Houssam Katrangi manage EKT, and Mireille Chahine is EKT’s accountant.  Amir Katrangi is the Director of EKT, and Maher and Houssam Katrangi are EKT associates.  Mohamad Katrangi founded EKT and remains active in operations of the company.  EKT Smart Technology, which has addresses in China and the United Kingdom, supplies goods to the SSRC.  Zhou Yishan, a Chinese national, is the Director of EKT Smart Technology, and is being designated for acting for or on behalf of, directly or indirectly, EKT Smart Technolgy.
              </div>
              <div className="paragraph">
                Golden Star Co. has provided, or attempted to provide, financial, material, technological, or other support for, or goods or services in support of, EKT.  Golden Star Co., which also does business as Smart Logistics Offshore, has facilitated EKT’s operations to the benefit of the SSRC.
              </div>
              <div className="paragraph">
                Polo Trading is being designated for being owned or controlled by Amir Katrangi.  Amir Katrangi founded Polo Trading in 2013.
              </div>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

export default withRouter(connect(mapDispatchToProps)(DocumentDisplay));