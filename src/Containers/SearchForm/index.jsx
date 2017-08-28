import React from 'react';
import PropTypes from 'prop-types'
import {Input, Button, Row, Col, message, Spin  } from 'antd';
import './index.sass';
import {Link, withRouter} from 'react-router-dom'
import AlbumsPage from '../AlbumsPage'
const axios = require('axios');
const normalAxios = axios.create();


const propTypes = {
	setArtistId: PropTypes.func,
};

const apikey = 'e7894acb1775228a5278623d078c3b83';

class SearchForm extends React.Component {
	constructor() {
		super()
	}

	state = {
		visible: false,
		artists: null,
		columns: [],
		searchText: '',
		loading: false
	};

	async search() {
		this.setState({
			loading: true
		});
		if (this.state.searchText !== '') {
			try {
				let data = await normalAxios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${this.state.searchText}&api_key=${apikey}&format=json`,   {
					responseType: 'json',
				});
				await this.setState({
					loading: false,
					artists: data.data.results.artistmatches.artist
				})
			} catch (e) {
				this.setState({
					loading: false,
				});
				message.error('Произошла ошибка, пожалуйста повторите запрос');
				throw(e)
			}
		} else {
			this.setState({
				loading: false,
			});
			message.error('Ведите название артиста')
		}

	}
	onSearch(e) {
		if (e.target.value === '') {
			this.setState({
				searchText: e.target.value
			})
		} else {
			this.setState({
				searchText: e.target.value
			})
		}
	}

	componentWillMount() {
		const { url } = this.props.match
		//this.routes = routeGen(url)
	}

	componentDidMount() {
		const { url } = this.props.match
		//this.props.routesNestedUpdate({ path: url, routes: this.routes })
	}

	render() {
		const {artists} = this.state;

		return (
			<div className="search-form-page">
				<div className="page-inner">
					<h1>Выбор исполнителя</h1>
					<div className="search">
						<Input
							type="text"
							placeholder="Искать..."
							onChange={this.onSearch.bind(this)}
						/>
						<Button type="primary" onClick={this.search.bind(this)}>
							Искать {this.state.searchText}
						</Button>
					</div>
					<div className="artists-list">
						{this.state.loading ? <div className="spinner"><Spin />Загрузка</div> : null}
						{
							artists ?
								<div className="inner">
									{
										artists.length !== 0 ?
											artists.map((item, i) => {
												return (
													<Link key={i} to={`/albumsPage`} onClick={this.props.setArtistId.bind(this, item.name)}>
														<div className="artist" >{item.name}</div>
													</Link>
												)
											})
										: <div>По данному исполнителю не найдено не одной записи</div>
									}
								</div>
							: null
						}
					</div>
				</div>

			</div>
		)
	}
}
SearchForm.propTypes = propTypes;
export default withRouter(SearchForm)