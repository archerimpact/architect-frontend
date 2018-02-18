import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchSources from '../../../components/Source/search';
import './style.css';
import * as server_utils from '../../../server/utils';
import * as actions from '../../../redux/actions/';
import { bindActionCreators } from 'redux';

class SourcesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {Toggled: true};
		this.toggleViews = this.toggleViews.bind(this);
	}

	componentDidMount() {
    	this.props.actions.fetchProjectSources(this.props.projectid);
  	}

  	componentWillReceiveProps = (newprops) => {
	    if (this.props.match.params.id != newprops.match.params.id) {
    		this.props.actions.fetchProjectSources(newprops.projectid);
	    }
	}
	toggleViews() {
		this.setState({Toggled: !this.state.Toggled});
	}

	getViews(thumbnailView) {
		return (
			<Table
				multiSelectable={true}
			>
				<TableHeader>
					<TableRow>
						<TableHeaderColumn>Name</TableHeaderColumn>
						<TableHeaderColumn>Content</TableHeaderColumn>
						<TableHeaderColumn>Number of Entities</TableHeaderColumn>
						<TableHeaderColumn>Graph</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody
					showRowHover={true}
				>
					{this.props.documents.map((vertex, id) => {
						return(
							<TableRow key={id}>
								<TableRowColumn>{vertex.name}</TableRowColumn>
								<TableRowColumn>{vertex.source.document.content}</TableRowColumn>
								<TableRowColumn>{vertex.source.document.entities.length}</TableRowColumn>
								<TableHeaderColumn><a href={"/source/" + vertex._id}>View Details</a></TableHeaderColumn>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		);
	}

	render() {
		return(
			<div>
			    <SearchSources />
			    <p></p>
				<h3>Sources</h3>
				{this.getViews()}
			</div>
		);
	};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

function mapStateToProps(state) {
	if (state.data.savedSources.status === 'isLoading') {
	    return {
	      status: state.data.savedSources.status,
	      documents: []
	      }
	  } else {
	      return {
	      status: state.data.savedSources.status,
	          documents: state.data.savedSources.documents,
	      }
	  }
}
 
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SourcesTable));