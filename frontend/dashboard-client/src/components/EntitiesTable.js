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


class EntitiesTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			entities: this.props.entities
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
			        <TableHeaderColumn>Name</TableHeaderColumn>
			        <TableHeaderColumn>Type</TableHeaderColumn>
			        <TableHeaderColumn>Document</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			    <TableBody
			    	showRowHover={true}>
			    	{this.state.entities.map((entity) => {
			    		return(
			    			<TableRow>
			    				<TableRowColumn>{this.state.entities.indexOf(entity)}</TableRowColumn>
			        			<TableRowColumn>{entity.name}</TableRowColumn>
			        			<TableRowColumn>{entity.type}</TableRowColumn>
			        			<TableRowColumn><Link to="/document" style={{color: 'inherit' }}>Go to Document</Link></TableRowColumn>
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
        entityNames: state.data.entityNames
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitiesTable)