import React, {Component} from 'react';
import {dependencies, devDependencies} from '../../../package.json';
import {Route, Redirect, Switch} from 'react-router-dom';
import AlbumsPage from '../../Containers/AlbumsPage/index';
import SearchForm from '../../Containers/SearchForm/index';

const deps = Object.assign({}, dependencies, devDependencies);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artistName: null
		}
	}

	setArtistId (name) {
		this.setState({
			artistName: name
		})
	}

	render() {
		return (
			<div>
				<div class="container">
					<Redirect to="/searchForm"/>
					<Route path="/albumsPage" render={() => (
						<AlbumsPage artistName={this.state.artistName}/>
					)}/>
					<Route path="/searchForm" render={() => (
						<SearchForm setArtistId={this.setArtistId.bind(this)} />
					)}/>
				</div>
			</div>
		);
	}
}

export default App;
