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

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Sources from '../../components/Source'
import SearchSources from '../../components/Source/search';
import './style.css';

class SourcesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {Toggled: true};
		this.toggleViews = this.toggleViews.bind(this);
	}

	toggleViews() {
		this.setState({Toggled: !this.state.Toggled});
	}

	getViews(thumbnailView) {
		if (thumbnailView) {
			return <Sources/>;
		} else {
			return (
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
									<TableRowColumn>{document.name}</TableRowColumn>
									<TableRowColumn>{document.content}</TableRowColumn>
									<TableRowColumn>{document.entities.length}</TableRowColumn>
									<TableHeaderColumn><a href={"/source/" + document._id}>View Details</a></TableHeaderColumn>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			);
		}
	}

	render() {
		return(
			<div>
				<Toggle className="toggle"
			      label="Source View"
			      labelPosition = "right"
			      style={
			      	{marginBottom: 16, maxWidth: 150}
			      }
			      onToggle={this.toggleViews}
			      toggle={this.state.Toggled}
			    />
			    <SearchSources />
			    <p></p>
				<h3>Sources</h3>
				{this.getViews(this.state.Toggled)}
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