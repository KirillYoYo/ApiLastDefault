import React from 'react';
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'
const axios = require('axios');
const normalAxios = axios.create();
import {Input, Button, Row, Col, message, Spin } from 'antd';
import './index.sass';

const propTypes = {
	artistName: PropTypes.number,
};

const apikey = 'e7894acb1775228a5278623d078c3b83';

const limit = 17;

class AlbumsPage extends React.Component {
	constructor() {
		super();
		this.state = {
			albums: null,
			loading: false,
			page: 0,
			endAlbums: false
		}
	}

	//Nullset - groupe

	async getAlbums (params) {
		let par = params ? params : {page: 0, limit: limit}
		this.setState({
			loading: true,
		});
		try {
			let data = await normalAxios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${this.props.artistName}&api_key=${apikey}&format=json&limit=${par.limit}&page=${par.page}`,   {
				responseType: 'json',
			});
			if (this.state.albums) {
				this.setState({
					loading: false,
					albums: this.state.albums.concat(data.data.topalbums.album),
					page: this.state.page + par.limit,
					endAlbums: data.data.topalbums.album.length === 0
				})
			} else {
				this.setState({
					loading: false,
					albums: data.data.topalbums.album,
					page: this.state.page + par.limit,
					endAlbums: data.data.topalbums.album.length === 0
				})
			}

		} catch (e) {
			this.setState({
				loading: false,
			});
			message.error('Произошла ошибка, пожалуйста повторите запрос');
			throw(e)
		}
	}

	componentDidMount() {
		this.getAlbums()
	}

	getName (name) {
		if (!name || name === '' || name === 'undefined' || name === '(null)' ) {
			return '---'
		} else {
			return name
		}
	}

	renderAlbums (albums) {
		if (!albums) {
			return false
		}
		let render = null;

		if (albums.length === 0) {
			render = <div>Нет альбомов</div>
		} else {
			render = albums.map((item, i) => {
				return (
					<div className="album" key={i}>
						<div className="name">{this.getName(item.name)}</div>
						<div className="img">
							{/*костыль*/}
							<img src={
								item.image[0][Object.keys(item.image[0])[0]] ?
									item.image[0][Object.keys(item.image[0])[0]]
									: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvVlXwLFqlc6_Gg2wUhEFimjZIK8tq6dSUyr1zxn1eXYhbqVQC'
							} width="120" alt=""/>
						</div>
						<div className="href"><a href={item.url}>Ссылка на альбом</a></div>
					</div>
				)
			})
		}
		return render
	}

	render() {
		const {albums} = this.state;

		return (
			<div className="page-albums">
				<div className="page-inner">
					<h3>Альбомы группы {this.props.artistName}</h3>
					<div className="albums">
						{
							this.renderAlbums(albums)
						}
					</div>
					{this.state.loading ? <div className="spinner"><Spin />Загрузка</div> : null}
					{
						albums && albums.length > 0 ?
							!this.state.endAlbums ?
								<a className="load-more" onClick={this.getAlbums.bind(this, {page: this.state.page, limit: limit})}>Загрузить еще</a>
							: <div className='allDone'>Все альбомы загруженны</div>
						: null

					}
					<div className="back">
						<Link to={`/searchForm`} >
							<div className="" >Назад на страницу исполнителей</div>
						</Link>
					</div>
				</div>
			</div>
		)
	}
}
export default withRouter(AlbumsPage)