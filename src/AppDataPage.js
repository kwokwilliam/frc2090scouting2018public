import React, { Component } from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import 'bootstrap/dist/css/bootstrap.css';

import Checkbox from "material-ui/Checkbox";

// AppDataPage is the main app page for the application. It has all the input boxes for the team to input data to
class AppDataPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRef: null,
            errorMessage: "",
            teamNumber: "",
            matchNumber: "",
            switchCount: 0,
            scaleCount: 0,
            vaultCount: 0,
            forceCount: 0,
            levitateCount: 0,
            boostCount: 0,
            notes: "",
            password: "",
            parked: false,
            climbed: false,
            confirmation: false
        };
    }

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

    // Checks if the match exists before adding it to the database. If the match
    // already exists for the team, then it won't submit.
    containsMatch = () => {
        let found = false;
        if (this.state.dataRef && this.state.dataRef[this.state.teamNumber] &&
            this.state.dataRef[this.state.teamNumber].matches) {
            let x = this.state.dataRef[this.state.teamNumber].matches;
            Object.keys(x).forEach((d, i) => {
                if (x[d].matchNumber === Number(this.state.matchNumber)) {
                    found = true;
                }
            })
        }
        return found;
    }

    // Submit checks for validity, then if all conditions are met, it will add it to the database.
    submit = () => {
        if (this.state.teamNumber === "") {
            this.setState({ errorMessage: "Error: Team not selected" });
        } else if (this.state.matchNumber === "" || Number(this.state.matchNumber) < 1) {
            this.setState({ errorMessage: "Error: Invalid match number" });
        } else if (this.containsMatch(this.state.teamNumber)) {
            this.setState({ errorMessage: "Error: Match already exists! Someone else must've filled it out already. Don't submit this one" });
        } else if (this.state.password !== "client_side_passcode") {
            this.setState({ errorMessage: "Error: Invalid passcode" });
        } else if (!this.state.confirmation) {
            this.setState({ errorMessage: "Error: You are unsure about submitting" });
        } else {
            let matchObj = {
                matchNumber: Number(this.state.matchNumber),
                switchCount: Number(this.state.switchCount),
                scaleCount: Number(this.state.scaleCount),
                vaultCount: Number(this.state.vaultCount),
                forceCount: Number(this.state.forceCount),
                levitateCount: Number(this.state.levitateCount),
                boostCount: Number(this.state.boostCount),
                notes: this.state.notes,
                parked: this.state.parked,
                climbed: this.state.climbed
            }
            this.dataRef.child(`${this.state.teamNumber}/matches/`).push(matchObj);
            this.setState({
                errorMessage: "",
                teamNumber: "",
                matchNumber: "",
                switchCount: 0,
                scaleCount: 0,
                vaultCount: 0,
                forceCount: 0,
                levitateCount: 0,
                boostCount: 0,
                notes: "",
                password: "",
                parked: false,
                climbed: false,
                confirmation: false
            });
        }
    }

    // Clear is for the clear button. Sets state of everything to nothing.
    clear = () => {
        this.setState({
            errorMessage: "",
            teamNumber: "",
            matchNumber: "",
            switchCount: 0,
            scaleCount: 0,
            vaultCount: 0,
            forceCount: 0,
            levitateCount: 0,
            boostCount: 0,
            notes: "",
            password: "",
            parked: false,
            climbed: false,
            confirmation: false
        })
    }

    // This is a test/initial use function that I used to add teams to the database.
    // Yes, I added them manually. There's probably a waaaaaay better way if you use excel/read from a csv file.
    // But I didn't do that.
    addTeams = () => {
        let teams = [
            { number: "216", name: "More RoboDawgs" },
            { number: "244", name: "RoboDawgs 3D" },
            { number: "288", name: "The RoboDawgs" },
            { number: "359", name: "Hawaiian Kids (Waialua)" },
            { number: "368", name: "Team Kika Mana (McKinley)" },
            { number: "1378", name: "Hilo Viking Robotics" },
            { number: "1622", name: "Team Spyder" },
            { number: "1661", name: "The Griffitrons" },
            { number: "1739", name: "Chicago Knights" },
            { number: "2090", name: "Buff n blue" },
            { number: "2437", name: "Lancer Robotics (Sacred Hearts)" },
            { number: "2438", name: "'Iobotics (Iolani)" },
            { number: "2439", name: "Bearbotics (Baldwin)" },
            { number: "2441", name: "Spartechs (Maryknoll)" },
            { number: "2443", name: "Blue Thunder (Maui High School)" },
            { number: "2444", name: "Kamehameha RoboWarriors (Kamehameha)" },
            { number: "2445", name: "RoboKAP (Kapolei)" },
            { number: "2465", name: "Kauaibots (Kauai)" },
            { number: "2477", name: "Maurader Rascals (Waipahu)" },
            { number: "2853", name: "Hot Spot Robotics (Millilani)" },
            { number: "2896", name: "MechaMonarchs (Damien Memorial)" },
            { number: "3008", name: "Team Magma (Kalani)" },
            { number: "3721", name: "Charger Robotics (Pearl City)" },
            { number: "3800", name: "Mustangs (Kalaheo)" },
            { number: "3878", name: "Wildcats (Konowaena)" },
            { number: "3881", name: "WHEA Sharkbots" },
            { number: "3882", name: "Lunas (Lahainaluna)" },
            { number: "4253", name: "Raid Zero" },
            { number: "4270", name: "Crusaders (St. Louis)" },
            { number: "4984", name: "BULLSEYE" },
            { number: "5625", name: "TrojanBots (St. Anthony)" },
            { number: "5701", name: "Indigo Ninjas" },
            { number: "6308", name: "SPCS Hafabots" },
            { number: "6309", name: "SPCS Koko Tek" },
            { number: "6704", name: "Owl Robotics (Mid Pacific)" },
            { number: "6909", name: "SAKURA Tempesta" },
            { number: "7069", name: "Taipei 101" }
        ];
        if (this.state.dataRef === null) {
            teams.forEach((d) => {
                this.dataRef.child(`${d.number}`).set(d);
            })
        } else {
            teams.forEach((d) => {
                this.dataRef.child(`${d.number}`).update(d);
            })
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    render() {
        return (
            <div className="centered global">
                <Link to="/teamdata"><button type="button" className="btn btn-primary">Team Data</button></Link>
                <Link to="/teamglobaldata"><button type="button" style={{ marginLeft: "5px" }} className="btn btn-primary">Segmented Ranking</button></Link>
                <br /><br />
                <h2>Welcome to William's scouting app</h2>
                <h5>This page is non functional unless you create your own database</h5>
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
                <br />
                <br />

                <div className="form-group">
                    <span className="input-group-addon">Match number:&nbsp;</span>
                    <input className="form-control"
                        name="matchNumber"
                        value={this.state.matchNumber}
                        type="Number"
                        placeholder="Match Number"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                </div>

                <br />

                <div className="input-group">
                    <span className="input-group-addon">Switch count:&nbsp;</span>
                    <input className="form-control"
                        name="switchCount"
                        value={this.state.switchCount > 0 ? this.state.switchCount : ""}
                        placeholder="Switch Count (short one)"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ switchCount: this.state.switchCount === 0 ? this.state.switchCount : this.state.switchCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ switchCount: this.state.switchCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <div className="input-group">
                    <span className="input-group-addon">Scale count:&nbsp;</span>
                    <input className="form-control"
                        name="scaleCount"
                        value={this.state.scaleCount > 0 ? this.state.scaleCount : ""}
                        placeholder="Scale Count (tall one)"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ scaleCount: this.state.scaleCount === 0 ? this.state.scaleCount : this.state.scaleCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ scaleCount: this.state.scaleCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <div className="input-group">
                    <span className="input-group-addon">Vault count:&nbsp;</span>
                    <input className="form-control"
                        name="vaultCount"
                        value={this.state.vaultCount > 0 ? this.state.vaultCount : ""}
                        placeholder="Vault Count (feeding hole)"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ vaultCount: this.state.vaultCount === 0 ? this.state.vaultCount : this.state.vaultCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ vaultCount: this.state.vaultCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <p>I dont check for maximum 3 for force, levitate, or boost here in my code, so please dont go over 3.
                    These are the towers that are behind the driver station. Force is the one all the way to the left, Levitate is in the middle, and Boost is on the right.
                </p>
                <br />
                <div className="input-group">
                    <span className="input-group-addon">Force count:&nbsp;</span>
                    <input className="form-control"
                        name="forceCount"
                        value={this.state.forceCount > 0 ? this.state.forceCount : ""}
                        placeholder="Force cube count"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ forceCount: this.state.forceCount === 0 ? this.state.forceCount : this.state.forceCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ forceCount: this.state.forceCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <div className="input-group">
                    <span className="input-group-addon">Levitate count:&nbsp;</span>
                    <input className="form-control"
                        name="levitateCount"
                        value={this.state.levitateCount > 0 ? this.state.levitateCount : ""}
                        placeholder="Levitate cube count"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ levitateCount: this.state.levitateCount === 0 ? this.state.levitateCount : this.state.levitateCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ levitateCount: this.state.levitateCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <div className="input-group">
                    <span className="input-group-addon">Boost count:&nbsp;</span>
                    <input className="form-control"
                        name="boostCount"
                        value={this.state.boostCount > 0 ? this.state.boostCount : ""}
                        placeholder="Boost cube count"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ boostCount: this.state.boostCount === 0 ? this.state.boostCount : this.state.boostCount - 1 })
                        }}>-</button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            this.setState({ boostCount: this.state.boostCount + 1 })
                        }}>+</button>
                    </div>
                </div>
                <br />
                <Checkbox
                    className="centered"
                    label="Parked?"
                    checked={this.state.parked}
                    onCheck={() =>
                        this.setState({ parked: !this.state.parked })
                    }
                    style={{ width: "10vw" }}
                />
                <Checkbox
                    className="centered"
                    label="Climbed?"
                    checked={this.state.climbed}
                    onCheck={() =>
                        this.setState({ climbed: !this.state.climbed })
                    }
                    style={{ width: "10vw" }}
                />
                <br />
                <div className="form-group">
                    <span className="input-group-addon">Match notes:&nbsp;</span>
                    <input className="form-control"
                        name="notes"
                        value={this.state.notes}
                        placeholder="Match notes (try to keep it short, but descriptive)"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                </div>
                <Checkbox
                    className="centered"
                    label="Confirm?"
                    checked={this.state.confirmation}
                    onCheck={() =>
                        this.setState({ confirmation: !this.state.confirmation })
                    }
                    style={{ width: "10vw" }}
                />
                <br />
                <div className="form-group">
                    <input className="form-control"
                        name="password"
                        type="password"
                        value={this.state.password}
                        placeholder="Team 2090 password"
                        onChange={(event) => { this.handleChange(event); }}
                    />
                </div>
                <br />
                {this.state.errorMessage && (
                    <div>
                        <p className="alert alert-danger">{this.state.errorMessage}</p>
                    </div>
                )}
                <br />
                <button type="button" className="btn btn-primary" onClick={() => this.submit()}>Submit</button>
                <br />
                <br />
                <button type="button" className="btn btn-secondary" onClick={() => this.clear()}>Clear</button>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                {/* <button onClick={() => this.addTeams()}>ADD DATA</button> */}
                {/* <button onClick={() => this.setState({ errorMessage: "test " })}>test</button> */}
            </div>
        )
    }
}

export default AppDataPage;