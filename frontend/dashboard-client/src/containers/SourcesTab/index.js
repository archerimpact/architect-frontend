import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class SourcesTable extends Component {
	render() {
		return(
			<div>
				<h3>Sources</h3>
				<Link to="/links" style={{color: 'inherit' }}>View saved links</Link>
				<p></p>  
				<Table
					multiSelectable={true}
				>
					<TableHeader>
						<TableRow>
							<TableHeaderColumn>Name</TableHeaderColumn>
							<TableHeaderColumn>Type</TableHeaderColumn>
							<TableHeaderColumn>Number of Entities</TableHeaderColumn>
							<TableHeaderColumn>Graph</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody
						showRowHover={true}
					>
						{this.props.savedSources.documents.map((document, id) => {
							return(
								<TableRow key={id}>
									<TableRowColumn>{document.title}</TableRowColumn>
									<TableRowColumn>{document.content}</TableRowColumn>
									<TableRowColumn>{document.entities.length}</TableRowColumn>
									<TableHeaderColumn><a href={"/source/" + document._id}>View Details</a></TableHeaderColumn>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	};
}

function mapStateToProps(state) {
	return {
		savedSources: state.data.savedSources
	};
}
 
export default connect(mapStateToProps)(SourcesTable);