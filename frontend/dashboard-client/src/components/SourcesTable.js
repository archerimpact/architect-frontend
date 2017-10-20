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
import * as actions from '../actions/';
import * as server from '../server/';

class SourcesTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			documents: this.props.savedDocuments.documents
		}
	}

	/*componentWillMount = () => {
        server.getDocuments()
            .then((data) => {
                this.setState({
                    documents: data
                })
                this.props.dispatch(actions.addDocuments(data))
        })
    }*/

	componentWillReceiveProps(nextProps) {
		this.setState({
			documents: nextProps.savedDocuments.documents
		})
	}



	render (){
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
				      </TableRow>
				    </TableHeader>
				    <TableBody
				    	showRowHover={true}>
				    	{this.state.documents.map((document) => {
				    		return(
				    			<TableRow>
				        			<TableRowColumn><a href={"/documents/" + document.id}>{document.name} </a></TableRowColumn>
				        			<TableRowColumn>{document.type}</TableRowColumn>
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
        projects: state.data.projects,
        savedDocuments: state.data.savedDocuments
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(SourcesTable)