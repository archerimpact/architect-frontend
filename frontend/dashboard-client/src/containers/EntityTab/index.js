import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class EntitiesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			currentEntity: null
		};
		this.getEntitySource = this.getEntitySource.bind(this);
		this.openEntityDrawer = this.openEntityDrawer.bind(this);
		this.closeEntityDrawer = this.closeEntityDrawer.bind(this);
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

	openEntityDrawer = (row) => {
		var currentEntity = this.props.savedEntities.entities[row];
		this.setState({drawerOpen: true, currentEntity: currentEntity});
	}

	closeEntityDrawer = () => {
		this.setState({drawerOpen: false, currentEntity: null});
	}

	entityDrawer() {
		return (
			<div style={{textAlign: 'left', paddingLeft: '10px'}}>
				<div>
				<p>Name: {this.state.currentEntity.name}</p>
				<p>Type: {this.state.currentEntity.type}</p>
				<p>Link: {this.state.currentEntity.link}</p>
				<p>Chips: {this.state.currentEntity.chips}</p>
				<p>Sources: {this.state.currentEntity.sources}</p>
				<p>Qid: {this.state.currentEntity.qid}</p>
				</div>
				<div>
					<br />
					<p>{this.getEntitySource(this.state.currentEntity)}</p>
				</div>
				<TextField
			      hintText="Add notes"
			      multiLine={true}
			      rows={1}
			    /><br />
			</div>
		);
	}

	render() {
		return(
			<div>
				<h3>Entities</h3>
				<Drawer width={300} containerStyle={{height: 'calc(100% - 64px)', top: 64}} openSecondary={true} open={this.state.drawerOpen} >
		          	<AppBar onLeftIconButtonTouchTap={this.closeEntityDrawer}
    						iconElementLeft={<IconButton><NavigationClose /></IconButton>}
    						title={'Entitiy Details'}
    						 />                
		          	{this.state.currentEntity ? this.entityDrawer() : null}
		        </Drawer>
				<Table multiSelectable={true} onRowSelection={this.openEntityDrawer}>
				    <TableHeader enableSelectAll>
				      <TableRow>
				        <TableHeaderColumn>Name</TableHeaderColumn>
				        <TableHeaderColumn>Type</TableHeaderColumn>
				        <TableHeaderColumn>Document</TableHeaderColumn>
				        <TableHeaderColumn>Graph</TableHeaderColumn>
				      </TableRow>
				    </TableHeader>
					<TableBody showRowHover={true} displayRowCheckbox={true}>
						{this.props.savedEntities.entities.map((entity) => {
				    		return(
				    			<TableRow>
				        			<TableRowColumn>{entity.qid && entity.qid.charAt(0) != "T" ? <a href={"https://www.wikidata.org/wiki/" + entity.qid}>{entity.name} </a> : entity.name} </TableRowColumn>
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