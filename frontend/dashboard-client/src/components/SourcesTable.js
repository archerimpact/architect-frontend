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
			documents: this.props.savedSources.documents,
			notes: this.props.savedSources.notes
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
			documents: nextProps.savedSources.documents,
			notes: nextProps.savedSources.notes
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
				        			<TableRowColumn><a href={"/sources/" + document.id}>{document.name} </a></TableRowColumn>
				        			<TableRowColumn>{document.type}</TableRowColumn>
				      			</TableRow>
				    		)
				    	})}
				    	{this.state.notes.map((note) => {
				    		return(
				    			<TableRow>
				        			<TableRowColumn><a href={"/sources/" + note._id}>{note.title} </a></TableRowColumn>
				        			<TableRowColumn>{note.content}</TableRowColumn>
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
        savedSources: state.data.savedSources
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(SourcesTable)