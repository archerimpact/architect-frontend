import React, { Component } from 'react';
import './style.css';

import EntityList from './components/EntityList.js';
import NodeGraph from '../../components/NodeGraph';
import Source from '../../components/Source';
import AddEntity from '../../components/Entity/AddEntity.js';

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import { withRouter } from 'react-router-dom';

class SourcePage extends Component {
	
	componentDidMount = () => {
		server.loadEntities()
			.then((data) => {
				this.props.dispatch(actions.addEntities(data.entities));          
				this.props.dispatch(actions.addSources(data.documents));
		}).catch((err) => console.log(err));
	};

	render() {
		return (
			<div>  
				<div className="centered">
					<div id="summary">      
						<h1 id="hello">Document</h1>
					</div>
					<AddEntity className="addentity" sourceid={this.props.match.params.id}/>
				</div>
				<div className="document-entities">
					<div className="left-column">
						<Source />
					</div>
					<div className="middle-column">
						<EntityList entities={this.props.sourceEntities}/>
					</div>
					<div className="right-column">
						<Paper>
							<NodeGraph entities={this.props.sourceEntities} sources={[this.props.currentSource]}/>
						</Paper>
					</div>
				</div>
			</div>
		);
	};
}
 
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
		dispatch: dispatch,
	};
}

function mapStateToProps(state, props) {
	var sourceid = props.match.params.id;
	return {
		savedEntities: state.data.savedEntities,
		savedSources: state.data.savedSources,
		sourceEntities: state.data.savedEntities.entities.filter(function (obj) {return obj.sources[0]=== sourceid}),
		currentSource: state.data.savedSources.documents.find((document) => {return document._id === sourceid}),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SourcePage));
