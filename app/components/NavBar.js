var React = require('react');

var Nav = React.createClass({
  navProfile: function () {
    this.props.navActions.navProfile(this.props.user.github_handle);
  },

  render: function () {
    var showNav = (this.props.user.isLoggedIn && (this.props.view !== 'CHALLENGE_ARENA' && this.props.view !== 'PAIR_ARENA'));
    var showLeave = (this.props.user.isLoggedIn && (this.props.view === 'CHALLENGE_ARENA' || this.props.view === 'PAIR_ARENA'));
    return (
      <div className="nav-bar">
        <ul>
          {showNav ? <li><a href='/logout'>Logout</a></li> : null}
          {showNav ? <li><a href='#' onClick={this.navProfile}>Profile</a></li> : null}
          {showNav ? <li><a href='#' onClick={this.props.navActions.navStaging}>Modes</a></li> : null}
          {showLeave ? <li><a href='#' onClick={this.props.navActions.navAwayFromArena}>LEAVE</a></li> : null}
        </ul>
      </div>
    );
  }
});

module.exports = Nav;
