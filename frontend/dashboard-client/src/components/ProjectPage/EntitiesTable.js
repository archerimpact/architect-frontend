import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';

class EntitiesTable extends Component {
	constructor(props) {
		super(props);
		this.getEntitySource = this.getEntitySource.bind(this);
	};

	getEntitySource(entity) {
		//TODO: refactor to account for entities having multiple sources
		var sourceid = entity.sources[0];
		var source = this.props.savedSources.documents.find(function (obj) {return obj._id=== sourceid});
		if (typeof(source) !== "undefined"){
			return source.content;
		} else {
			return "";
		};
	};

	render() {
		return(
			<div>
				<h3>Entities</h3>
				<Table
					multiSelectable={true}
				>
					<TableHeader>
					  <TableRow>
						<TableHeaderColumn>Name</TableHeaderColumn>
						<TableHeaderColumn>Type</TableHeaderColumn>
						<TableHeaderColumn>Document</TableHeaderColumn>
						<TableHeaderColumn>Graph</TableHeaderColumn>
					  </TableRow>
					</TableHeader>
					<TableBody
						showRowHover={true}
					>
						{this.props.savedEntities.entities.map((entity) => {
							return(
								<TableRow>
									<TableRowColumn><a href={"https://www.wikidata.org/wiki/" + entity.qid}>{entity.name} </a></TableRowColumn>
									<TableRowColumn>{entity.type}</TableRowColumn>
									<TableRowColumn>{this.getEntitySource(entity)}</TableRowColumn>
									<TableRowColumn>Go to Graph</TableRowColumn>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
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

function mapStateToProps(state) {
	return {
		savedEntities: state.data.savedEntities,
		entityNames: state.data.entityNames,
		projects: state.data.projects,
		savedSources: state.data.savedSources
	};
}
 
export default connect(mapStateToProps, mapDispatchToProps)(EntitiesTable);