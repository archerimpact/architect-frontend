import React, { Component } from 'react';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { connect } from 'react-redux';
import EntitiesList from '../../components/Entity/'

class EntitiesTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			currentEntity: null,
			entitySort: {by: 'dateAdded', type: null},
			queryEntity: null
		};
		this.getEntitySource = this.getEntitySource.bind(this);
		this.openEntityDrawer = this.openEntityDrawer.bind(this);
		this.closeEntityDrawer = this.closeEntityDrawer.bind(this);
		this.handleEntitySearch = this.handleEntitySearch.bind(this);
		this.handleChangeSort = this.handleChangeSort.bind(this);
	};

	getEntitySource(entity) {
		//TODO: refactor to account for entities having multiple sources
		var sourceid = entity.sources[0];
		var source = this.props.savedSources.documents.find(function (obj) {return obj._id=== sourceid});
		if (typeof(source) !== "undefined"){
			return source.content;
		} else {
			return "";
		}
	};

	//called from entity with this.props.onEntityClick(entity)
	openEntityDrawer = (entity) => {
		this.setState({drawerOpen: true, currentEntity: entity});
	}

	closeEntityDrawer = () => {
		this.setState({drawerOpen: false, currentEntity: null});
	}

	renderEntityDrawer() {
		return (
			<div style={{textAlign: 'left', paddingLeft: '10px'}}>
				<div>
					<b>Name: {this.state.currentEntity.name}</b>
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


	handleEntitySearch(event) {
		this.setState({
			queryEntity: event
		});
	};

	handleChangeSort(event, index, value) {
		this.setState({
			entitySort: {by: value, type: null},
		})
	}

	render() {
		if (this.props.status === 'isLoding') {
    		return (<div className="projects">
    					<p> Loading ... </p>
    				</div>
    			);
    	} else {
			return(
				<div>
					<h3>Entities</h3>
					<Drawer width={300} containerStyle={{height: 'calc(100% - 64px)', top: 64}} openSecondary={true} open={this.state.drawerOpen} >
			          	<AppBar onLeftIconButtonTouchTap={this.closeEntityDrawer}
	    						iconElementLeft={<IconButton><NavigationClose /></IconButton>}
	    						title={'Entitiy Details'}
	    						 />                
			          	{this.state.drawerOpen ? this.renderEntityDrawer() : null}
			        </Drawer>
			        <div>
			        	<AutoComplete
							floatingLabelText="Search for entity name"
							hintText="e.g. Person"
							dataSource={this.props.entities}
							onUpdateInput={this.handleEntitySearch}
							style={{width: 250, marginRight: 20}}
						/>
						<SelectField
				        	floatingLabelText="Sort By"
				        	value={this.state.entitySort.by}
				        	onChange={this.handleChangeSort}
				        >
							<MenuItem value={'name'} primaryText="Name" />
							<MenuItem value={'type'} primaryText="Type" />
							<MenuItem value={'source'} primaryText="Source" />
							<MenuItem value={'dateAdded'} primaryText="Date Added" />
				        </SelectField>
			        	<EntitiesList entities={this.props.entities} searchTerm={this.state.queryEntity} sortBy={this.state.entitySort} getSource={this.getEntitySource} onEntityClick={this.openEntityDrawer}/>
			        </div>
				</div>
			);      
		}
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: dispatch,
	};
}

function mapStateToProps(state, ownProps) {
	if (state.data.savedEntities.status === 'isLoding') {
		return {
			status: state.data.savedEntities.status,
	    }
	} else {
	    return {
			status: state.data.savedEntities.status,
			entities: state.data.savedEntities.entities,
			savedSources: state.data.savedSources
	    }
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(EntitiesTab);