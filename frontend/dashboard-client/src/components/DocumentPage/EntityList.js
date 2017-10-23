import React, { Component } from 'react';
import EntityBox from './EntityBox.js'
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';

class EntityList extends Component {

	 constructor(props) {
		super(props);
		this.state = {open: false};
		this.handleToggle = this.handleToggle.bind(this)
	}

  	handleToggle = () => {
  		console.log('toggle')
  		this.setState({open: !this.state.open})
  	};

	render() {
		return (
			<div onClick={this.handleToggle}>
				{this.props.entities.slice().reverse().map((entity) => {
					return (
						<div >
							<EntityBox entity={entity}/>
							<Drawer width={200} openSecondary={true} open={this.state.open} >
					          	<AppBar title="AppBar" />
					        </Drawer>
						</div>
					)
				})}
			</div>
		)
	}
}

export default EntityList
