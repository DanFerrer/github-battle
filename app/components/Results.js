import React from 'react';
import PropTypes from 'prop-types';
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { battle } from '../utils/api';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';

import queryString from 'query-string';

function ProfileList({ profile }) {
	return (
		<ul className='card-list'>
			<li>
				<FaUser color='rgb(239, 115, 115)' size={22} />
				{profile.name}
			</li>
			{profile.location && (
				<li>
					<Tooltip text="Users Location">
						<FaCompass color='rgb(144, 115, 255)' size={22} />
						{profile.location}
					</Tooltip>
				</li>
			)}
			{profile.company && (
				<li>
					<Tooltip text="Users Company">
						<FaBriefcase color='#795548' size={22} />
						{profile.company}
					</Tooltip>
				</li>
			)}
			<li>
				<FaUsers color='rgb(129, 195, 245)' size={22} />
				{`${profile.followers.toLocaleString()} followers`} 
			</li>
			<li>
				<FaUserFriends color='rgb(64, 183, 95)' size={22} />
				{`${profile.following.toLocaleString()} following`} 
			</li>
		</ul>
	);
}

ProfileList.propTypes = {
	profile: PropTypes.object.isRequired
};

export default class Results extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			winner: null,
			loser: null,
			error: null,
			loading: true
		};
	}

	async startBattle(playerOne, playerTwo) {
		try {
			const players = await battle([playerOne, playerTwo]);
			const [winner, loser] = players;
		
			this.setState({
				winner,
				loser,
				error: null,
				loading: false
			});
		} catch (err) {
			this.setState({
				error: err.message,
				loading: false
			});
		}
	}

	componentDidMount() {
		const { playerOne, playerTwo } = queryString.parse(this.props.location.search);
		this.startBattle(playerOne, playerTwo);
	}

	render() {
		const { winner, loser, error, loading } = this.state;

		if (loading === true) {
			return <Loading text='Battling' />;
		}

		if (error) {
			return (
				<p className='center-text error'>{error}</p>
			);
		}

		return (
			<React.Fragment>
				<div className='grid space-around container-sm'>
					<Card 
						header={winner.score === loser.score ? 'Tie' : 'Winner'}
						subheader={`Score: ${winner.score.toLocaleString()}`}
						avatar={winner.profile.avatar_url}
						href={winner.profile.html_url}
						name={winner.profile.login}
					>
						<ProfileList profile={winner.profile}/>
					</Card>	
					<Card 
						header={winner.score === loser.score ? 'Tie' : 'Loser'}
						subheader={`Score: ${loser.score.toLocaleString()}`}
						avatar={loser.profile.avatar_url}
						href={loser.profile.html_url}
						name={loser.profile.login}
					>
						<ProfileList profile={loser.profile}/>
					</Card>	
				</div>
				<Link className="btn dark-btn btn-space" to="/battle">
					Reset
				</Link>
			</React.Fragment>
			
		);
	}
}
