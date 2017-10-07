import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';


const style = {
	width: "80%",
	marginLeft: 20,
	textAlign: 'center',
	display: 'inline-block',
};

const circle_style = {
	width: 60,
	height:60,
	margin: 20,
	textAlign: 'center',
	display: 'inline-block',
	backgroundImage: "url('/daryus.jpg')",
};


class EntityBox extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: props.name,
			type: props.type,
			tags: ["Alice Ma"]
		}
	}

	render() {
		return (
			<div>
				<Paper style={style}>
					<div className=	"entity-box">
					<Paper style={circle_style} circle={true}>
					</Paper>
					<div className="right-column">
						<b> {this.props.name} </b>
						<i> {this.props.type} </i>
						<a href={this.props.link} target="_blank">{this.props.link}</a>
					</div>
					</div>
				</Paper>
			</div>

			)
	}

}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityBox)