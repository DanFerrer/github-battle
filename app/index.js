import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';

import { ThemeProvider } from './contexts/theme';
import Popular from './components/popular';
import Battle from './components/Battle';
import Nav from './components/nav';
import Results from './components/results';

function badRoute() {
	return (
		<h1>404</h1>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			theme: 'light',
			toggleTheme: () => {
				this.setState(({theme}) => {
					return {
						theme: theme === 'light' ? 'dark' : 'light'
					};
				});
			}
		};
	}
	render() {
		return (
			<Router>
				<ThemeProvider value={this.state}>
					<div className={this.state.theme}>
						<div className='container'>
							<Nav />
							<Switch>
								<Route exact path='/' component={Popular} />
								<Route exact path='/battle' component={Battle} />
								<Route path='/battle/results' component={Results}/> 
								<Route render={badRoute}/>
							</Switch>
						</div>
					</div>
				</ThemeProvider>
			</Router>
		);
	}
}

export default App;

ReactDOM.render(
	<App />,
	document.getElementById('app')
);