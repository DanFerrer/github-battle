const id = 'dfb5340867440fb808cf';
const sec = 'a2b2ca575d0e4420c57ca2ae96589eb48d81de4b';
const params = `?client_id=${id}&client_secret=${sec}`;

function getErrorMsg(message, username) {
	if (message === 'Not Found') {
		return `${username} doesn't exist`;
	}

	return message;
}

function calculateScore(followers, repos) {
	return (followers * 3) + getStarCount(repos);
}

function getStarCount(repos) {
	return repos.reduce((count, { stargazers_count }) => count + stargazers_count, 0);
}

async function getProfile(username) {
	const res = await fetch(`https://api.github.com/users/${username}${params}`);
	const profile = await res.json();

	if (profile.message) {
		throw new Error(getErrorMsg(profile.message, username));
	}

	return profile;
}

async function getRepos(username) {
	const res = await fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
	const repos = await res.json();

	if (repos.message) {
		throw new Error(getErrorMsg(repos.message, username));
	}

	return repos;
}

async function getUserData(player) {
	const results = await Promise.all([getProfile(player), getRepos(player)]);
	const [profile, repos] = results;

	return {
		profile,
		repos,
		score: calculateScore(profile.followers, repos)
	};
}

function sortPlayers(players) {
	return players.sort((a, b) => b.score - a.score);
}

export async function battle (players) {
	const results = await Promise.all([getUserData(players[0]), getUserData(players[1])]);

	return sortPlayers(results);
}

export async function fetchPopularRepos(language) {
	const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

	const res = await fetch(endpoint);
	const data = await res.json();

	if (!data.items) {
		throw new Error(data.message);
	}

	return data.items;
}