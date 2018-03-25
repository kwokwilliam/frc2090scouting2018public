import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import TeamItem from './TeamItem';

// AllDataPage is the main page that shows segmented rankings of the teams
class AllDataPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRef: null,
            passcode: ""
        }
    }

    // When component mounts, connect to the database
    componentDidMount() {
        this.mounted = true;

        // Connects to the database and stores it into the state in JSON format
        // This is how firebase is generally used. You only connect to the database when
        // you want to write to it or authenticate with it.
        //
        // On change it resets the state, this means that when a value on the database is updated,
        // the app updates in real time, AUTOMATICALLY.
        this.dataRef = firebase.database().ref("teams/");
        this.dataRef.on("value", snapshot => {
            if (this.mounted) {
                this.setState({ dataRef: snapshot.val() });
            }
        });
    }

    // When component unmounts, keep state of mount so it doesn't keep polling the database and get errors
    componentWillUnmount() {
        this.mounted = false;
    }

    // Handles the change of the specific input text box
    handleChange = (event) => {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // getBestTeams finds the best teams for each of the categories in the categories array down below.
    // returns an object that has keys from categories, and these keys map to an array of teams, ordered from best to worst
    // each team is stored in an object with "team" as their team number, and "number" as what number is being written to the array
    // IE, best average, or best count.
    // Example output in JSON format looks like this:
    // {
    //     boostCount: [
    //         {team: 359, number: 30.6},
    //         {team: ..., number: ...}
    //     ],
    //     climbed: [
    //         {},
    //         {}
    //     ]
    // }
    // This is used by the render method below
    // Surprisingly, the calculation is almost instantaneous. 
    getBestTeams = () => {
        let teams = this.state.dataRef;
        let categories = ["boostCount", "climbed", "forceCount", "levitateCount", "parked", "scaleCount", "switchCount", "vaultCount"];
        let insertAverages = {}; // return object that looks like {boostcount: [{number: 359, avg: _____}, {}]} // then lodash it to order, then return the object
        categories.forEach((d) => {
            insertAverages[d] = [];
        });

        // Loop through all teams (team numbers are the key in the teams object)
        Object.keys(teams).forEach((d, i) => {
            let matches = teams[d].matches;

            // For each category,
            categories.forEach((category) => {
                let categoryArr = [];

                // Get all matches and find calculations based on it
                Object.keys(matches).forEach((match) => {
                    categoryArr.push(matches[match][category]);
                });

                // Specifically filter for climbed or parked as count based instead of average based.
                if (category === "climbed" || category === "parked") {
                    let totalForCat = categoryArr.reduce((acc, add) => { return add ? acc + 1 : acc }, 0);
                    insertAverages[category].push({ team: d, number: totalForCat });
                } else {
                    let totalForCat = categoryArr.reduce((acc, add) => { return add + acc }, 0);
                    insertAverages[category].push({ team: d, number: totalForCat / categoryArr.length });
                }
            })
        });

        let returnObj = {};

        // Use lodash for ordering by scores in descending order, and team number in ascending order
        categories.forEach((d) => {
            returnObj[d] = _.orderBy(insertAverages[d], ['number', 'team'], ['desc', 'asc']);
        })

        //console.log(returnObj);
        return returnObj;
    }


    render() {
        // Get objects only if the database exists
        // This is done because when the object loads, the connection to firebase isn't instantaneously made, so it'll crash
        // if the object is not there.
        let object = {};
        if (this.state.dataRef) {
            object = this.getBestTeams();
        }
        return (
            <div className="centered global">
                <Link to="/"><button type="button" className="btn btn-primary">Back home</button></Link>
                <br /><br />
                <h2>Look at data about teams</h2>
                <hr />
                {/* client side validation is very bad, can easily be replaced by having the password be stored in the database instead and checking with the database object */}
                {this.state.dataRef &&
                    <div>
                        <h2>Click on a team to cross them out, these numbers are based on total count for climb/park, and average for other things</h2>
                        <hr />
                        <h3>Best scale scorers</h3>
                        <ol>
                            {object["scaleCount"].map((d) => {
                                return <TeamItem key={"scaleCount" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Best switch scorers</h3>
                        <ol>
                            {object["switchCount"].map((d) => {
                                return <TeamItem key={"switchCount" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Best vault scorers</h3>
                        <ol>
                            {object["vaultCount"].map((d) => {
                                return <TeamItem key={"vaultCount" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Best climbers</h3>
                        <ol>
                            {object["climbed"].map((d) => {
                                return <TeamItem key={"climbed" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Best parkers</h3>
                        <ol>
                            {object["parked"].map((d) => {
                                return <TeamItem key={"parked" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Teams that like going for levitate</h3>
                        <ol>
                            {object["levitateCount"].map((d) => {
                                return <TeamItem key={"levitateCount" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Teams that like going for force</h3>
                        <ol>
                            {object["forceCount"].map((d) => {
                                return <TeamItem key={"forceCount" + d.team} d={d} />
                            })}
                        </ol>
                        <hr />
                        <h3>Teams that like going for boost</h3>
                        <ol>
                            {object["boostCount"].map((d) => {
                                return <TeamItem key={"boostCount" + d.team} d={d} />
                            })}
                        </ol>
                    </div>
                }

                {/* <button onClick={() => this.getBestTeams()}>test</button> */}
            </div>
        )
    }
}

export default AllDataPage;