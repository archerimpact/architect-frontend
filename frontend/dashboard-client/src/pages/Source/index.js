import React, { Component } from 'react';
import './style.css';

import EntityList from './components/EntityList.js';
import NodeGraph from '../../components/NodeGraph';
import FakeSource from '../../components/Source/fakeSource';
import AddEntity from '../../components/Entity/AddEntity.js';

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';

class SourcePage extends Component {
	componentDidMount = () => {
    this.props.actions.getSource(this.props.match.params.id);
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
						<FakeSource />
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
		sourceEntities: state.data.pendingEntities.entities.filter(function (obj) {return obj.sources[0]=== sourceid}),
		currentSource: state.data.savedSources.documents.find((document) => {return document._id === sourceid}),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SourcePage);