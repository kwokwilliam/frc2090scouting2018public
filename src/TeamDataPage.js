import React, { Component } from 'react';
import firebase from 'firebase';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import 'bootstrap/dist/css/bootstrap.css';

// TeamDataPage shows data about each individual team depending on what team is selected.
class TeamDataPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRef: null,
            errorMessage: "",
            teamNumber: "",
            passcode: ""
        };
    }

    // Same deal with database connection
    componentDidMount() {
        this.mounted = true;
        this.dataRef = firebase.database().ref("teams/");
        this.dataRef.on("value", snapshot => {
            if (this.mounted) {
                this.setState({ dataRef: snapshot.val() });
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleChange = (event) => {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    // This is a quick function to turn the scores from an array into an object.
    // The object returned is in the format:
    // {
    //     match: ##,
    //     score: ##
    // }
    //
    // The array is x
    // matchL is not used, but I was too lazy to delete it (if I did I might've gotten errors)
    // 
    // Also the function is kinda ugly and not very easy to modify because I use single letters
    // as variable names. Sorry, i wanted to make this quickly.
    toDataObj = (x, matchL) => {
        let objList = [];
        x.forEach((d, i) => {
            objList.push({ match: i + 1, score: Number(d) });
        })
        return objList;
    }

    render() {
        // Push certain team's data to arrays used later.
        let name = "";
        let totality = false;
        let matchCount = 0;
        let matchNumbers = [];
        let switchScores = [];
        let scaleScores = [];
        let vaultScores = [];
        let forceCounts = [];
        let levitateCounts = [];
        let boostCounts = [];
        let notes = [];
        let parkedCount = 0;
        let climbedCount = 0;
        if (this.state.teamNumber !== "") {
            name = this.state.dataRef[this.state.teamNumber].name;
            let matches = this.state.dataRef[this.state.teamNumber].matches;
            if (matches) {
                Object.keys(matches).forEach((d, i) => {
                    totality = true;
                    matchCount++;
                    let x = matches[d];
                    matchNumbers.push(x.matchNumber);
                    switchScores.push(x.switchCount);
                    scaleScores.push(x.scaleCount);
                    vaultScores.push(x.vaultCount);
                    forceCounts.push(x.forceCount);
                    levitateCounts.push(x.levitateCount);
                    boostCounts.push(x.boostCount);
                    notes.push(x.notes);
                    if (x.parked) parkedCount++;
                    if (x.climbed) climbedCount++;
                })
            }
        }

        return (
            <div className="centered global">
                <Link to="/"><button type="button" className="btn btn-primary">Back home</button></Link>
                <br /><br />
                <h2>Look at data about the team</h2>
                <h5>Select a team number:</h5>

                <SelectField
                    className="centered"
                    floatingLabelText="Team Number"
                    placeholder="Team Number"
                    value={this.state.teamNumber}
                    onChange={event => {
                        this.setState({ teamNumber: event.target.textContent });
                    }}
                    fullWidth={true}
                >
                    <MenuItem value="" primaryText="" />
                    {this.state.dataRef &&
                        Object.keys(this.state.dataRef).map((d, i) => {
                            let asdf = this.state.dataRef[d];
                            return <MenuItem key={asdf.number} value={asdf.number} primaryText={asdf.number} />
                        })
                    }
                </SelectField>

                {/*All the data is drawn here, calculations done. It looks complex, but the hardest thing I do is use array.reduce(), which is 
                   a recursive function that can do things like count how many times something appears in an array, or add all the things in 
                   the array together. I also draw the charts using the recharts library.*/}
                {this.state.teamNumber !== "" && totality &&
                    <div>
                        <h4>You are now viewing data about team {this.state.teamNumber}, {name}. They have played {matchCount} {matchCount === 1 ? "match" : "matches"} out of 13 so far. Note values may not be in correct match order.</h4>
                        <br /><br />
                        <h5>Switch Scores</h5>
                        <p>Average switch cube count is <span className="red">{switchScores.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br />Maximum
                        switch score was <span className="red">{switchScores.reduce((acc, add) => { return acc > add ? acc : add }, switchScores[0])}</span>.<br />Minimum
                        was <span className="red">{switchScores.reduce((acc, add) => { return acc < add ? acc : add }, switchScores[0])}</span>.<br /> The scores are as
                        follows: <span className="red">{switchScores.map((d, i) => { return <span key={"switchScore" + i}>{d}{i === switchScores.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(switchScores, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <h5>Scale Scores</h5>
                        <p>Average scale cube count is <span className="red">{scaleScores.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br /> Maximum
                        scale score was <span className="red">{scaleScores.reduce((acc, add) => { return acc > add ? acc : add }, scaleScores[0])}</span>.<br />Minimum
                        was <span className="red">{scaleScores.reduce((acc, add) => { return acc < add ? acc : add }, scaleScores[0])}</span>.<br />The scores are as
                        follows: <span className="red">{scaleScores.map((d, i) => { return <span key={"scaleScore" + i}>{d}{i === scaleScores.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(scaleScores, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <h5>Vault Scores</h5>
                        <p>Average vault cube count is <span className="red">{vaultScores.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br /> Maximum
                        vault score was <span className="red">{vaultScores.reduce((acc, add) => { return acc > add ? acc : add }, vaultScores[0])}</span>.<br />Minimum
                        was <span className="red">{vaultScores.reduce((acc, add) => { return acc < add ? acc : add }, vaultScores[0])}</span>.<br /> The scores are as
                        follows: <span className="red">{vaultScores.map((d, i) => { return <span key={"vaultScore" + i}>{d}{i === vaultScores.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(vaultScores, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <br /><br />
                        <h5>Force Counts</h5>
                        <p>Average force count is <span className="red">{forceCounts.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br /> Maximum
                        force count was <span className="red">{forceCounts.reduce((acc, add) => { return acc > add ? acc : add }, forceCounts[0])}</span>.<br />Minimum
                        was <span className="red">{forceCounts.reduce((acc, add) => { return acc < add ? acc : add }, forceCounts[0])}</span>.<br /> The scores are as
                        follows: <span className="red">{forceCounts.map((d, i) => { return <span key={"forceCount" + i}>{d}{i === forceCounts.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(forceCounts, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <h5>Levitate Counts</h5>
                        <p>Average levitate count is <span className="red">{levitateCounts.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br /> Maximum
                        levitate count was <span className="red">{levitateCounts.reduce((acc, add) => { return acc > add ? acc : add }, levitateCounts[0])}</span>.<br />Minimum
                        was <span className="red">{levitateCounts.reduce((acc, add) => { return acc < add ? acc : add }, levitateCounts[0])}</span>.<br /> The scores are as
                        follows: <span className="red">{levitateCounts.map((d, i) => { return <span key={"levitateCount" + i}>{d}{i === levitateCounts.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(levitateCounts, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <h5>Boost Counts</h5>
                        <p>Average boost count is <span className="red">{boostCounts.reduce((acc, add) => { return acc + add }, 0) / matchCount}</span>.<br /> Maximum
                        boost count was <span className="red">{boostCounts.reduce((acc, add) => { return acc > add ? acc : add }, boostCounts[0])}</span>.<br />Minimum
                        was <span className="red">{boostCounts.reduce((acc, add) => { return acc < add ? acc : add }, boostCounts[0])}</span>.<br /> The scores are as
                        follows: <span className="red">{boostCounts.map((d, i) => { return <span key={"boostCount" + i}>{d}{i === boostCounts.length - 1 ? "" : "-"}</span> })}</span>
                        </p>
                        <LineChart width={250} height={200} data={this.toDataObj(boostCounts, matchNumbers)} margin={{ top: 0, right: 0, left: 10, bottom: 25 }}>
                            <XAxis dataKey="match" domain={["auto", "auto"]} label={{ value: "Matches", position: "bottom" }} type="number" />
                            <YAxis dataKey="score" domain={["auto", "auto"]} label={{ value: "Score", angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid stroke="#eee" strokeDashArray="3 3" />
                            <Tooltip />
                            <Line dot={true} type="monotone" dataKey="score" stroke={"#ff0000"} fill={"#ff0000"} />
                        </LineChart>
                        <br /><br />
                        <h5>Parked Counts</h5>
                        <p>Out of all the matches they played, they parked <span className="red">{parkedCount}/{matchCount}</span> times.</p>
                        <h5>Climbed Counts</h5>
                        <p>Out of all the matches they played, they climbed <span className="red">{climbedCount}/{matchCount}</span> times.</p>
                        <h5>Notes</h5>
                        <p>Here are some notes:</p>
                        {notes.map((d, i) => {
                            if (d !== "") {
                                return <div key={"notes" + i}>- Team's Match {i + 1}: {d}</div>
                            }
                        })}
                        <br />
                        <a href={`https://www.thebluealliance.com/team/${this.state.teamNumber}/2018`}>Learn more about the team on TheBlueAlliance</a>
                        <br /><br /><br /><br /><br /><br /><br />
                    </div>
                }

                {this.state.teamNumber !== "" && !totality &&
                    < div > <h4>You are now viewing data about team {this.state.teamNumber}, {name}. They have played {matchCount} {matchCount === 1 ? "match" : "matches"} out of 13 so far.</h4>
                        <br /> <br /> <p>There is no data for this team</p></div>
                }



            </div>
        )
    }
}

export default TeamDataPage;