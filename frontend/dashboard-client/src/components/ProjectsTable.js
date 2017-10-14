import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {
  Link
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';


class ProjectsTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			projects: this.props.projects
		}
	}

	render (){
		return(
			<Table
				multiSelectable={true}
			>
			    <TableHeader>
			      <TableRow>
			        <TableHeaderColumn>ID</TableHeaderColumn>
			        <TableHeaderColumn>Title</TableHeaderColumn>
			        <TableHeaderColumn>Owner</TableHeaderColumn>
			        <TableHeaderColumn>Last Action</TableHeaderColumn>
			        <TableHeaderColumn>Details</TableHeaderColumn>

			      </TableRow>
			    </TableHeader>
			    <TableBody
			    	showRowHover={true}>
			    	{this.state.projects.map((project) => {
			    		return(
			    			<TableRow>
			    				<TableRowColumn>{project.id}</TableRowColumn>
			        			<TableRowColumn>{project.title}</TableRowColumn>
			        			<TableRowColumn>{project.owner}</TableRowColumn>
			        			<TableRowColumn>{project.lastAction}</TableRowColumn>
			        			<TableRowColumn><Link to={"/project/" + project.id} style={{color: 'inherit' }}>Go to Project</Link></TableRowColumn>
			      			</TableRow>

			    		)

			    	})}
			    </TableBody>
			</Table>
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
        entityNames: state.data.entityNames,
        projects: state.data.projects
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsTable)