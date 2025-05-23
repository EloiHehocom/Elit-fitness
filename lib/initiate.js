async function initiateAuth(req, res) {
    const options = {
        requestType: 'code',
        clientId: process.env.HIGHLEVEL_CLIENT_ID,
        redirectUri: "http://localhost:3000/oauth/callback",
        scopes : [
            "calendars.readonly",
            "calendars.write",
            "calendars/events.readonly",
            "calendars/events.write",
            "calendars/groups.readonly",
            "calendars/groups.write"
        ]    
    }
    return res.redirect(`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=${options.requestType}&redirect_uri=${options.redirectUri}&client_id=${options.clientId}&scope=${options.scopes.join(' ')}`);
}

module.exports = initiateAuth;