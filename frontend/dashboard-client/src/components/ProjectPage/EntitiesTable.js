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
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';
import * as server from '../../server/';

class EntitiesTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			entities: this.props.savedEntities.entities
		}
	}

	componentWillMount = () => {
        server.loadEntities()
            .then((data) => {
                this.setState({
                    entities: data
                })
                this.props.dispatch(actions.addEntities(data))
        })
    }

	componentWillReceiveProps(nextProps) {
		this.setState({
			entities: nextProps.savedEntities.entities
		})
	}



	render (){
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
				      </TableRow>
				    </TableHeader>
				    <TableBody
				    	showRowHover={true}>
				    	{this.state.entities.map((entity) => {
				    		return(
				    			<TableRow>
				        			<TableRowColumn><a href={"https://www.wikidata.org/wiki/" + entity.qid}>{entity.name} </a></TableRowColumn>
				        			<TableRowColumn>{entity.type}</TableRowColumn>
				      			</TableRow>
				    		)
				    	})}
				    </TableBody>
				</Table>
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
        entityNames: state.data.entityNames,
        projects: state.data.projects
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(EntitiesTable)