// Home.js

import React, { Component } from 'react';
import axios from 'axios';
import url from 'url';
import {StyleSheet, Text, View} from 'react-native';
import {StackNavigator} from 'react-navigation';

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getTotalCountries(data) {
    var countries = [];
    for (var i = 0; i != data.length; i++) {
        var tmp = false;
        countries.forEach(item => {
            if (item === data[i]['attributes']['Country_Region']) {
                tmp = true;
            }
        });
        if (!tmp) countries.push(data[i]['attributes']['Country_Region']);
    }
    return countries.length;
}

function getLastUpdate(data) {
    var tab = [];
    for (var i = 0; i != data.length; i++) {
        tab.push(Number(data[i]['attributes']['Last_Update']));
    }
    var tmp = tab.sort(function(a, b) {
        return parseInt(b) - parseInt(a);
    })[0];
    var date = new Date(tmp);
    return date.toUTCString();
}

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            confirmed: null,
            deaths: null,
            recovered: null,
            countries: null,
            update: null,
        };
    }
    componentDidMount() {
        var payload = {
            f: 'json',
            where: 'Confirmed > 0',
            returnGeometry: 'false',
            outFields: '*',
            orderByFields: 'Confirmed desc',
            resultRecordCount: '1000',
        };
        var query = url.format({query: payload});
        fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query' + query)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({
                    data: data['features'],
                });
                var totalConfirmed = 0;
                var totalDeaths = 0;
                var totalRecovered = 0;
                var totalCountries = getTotalCountries(this.state.data);
                for (var i = 0; i != this.state.data.length; i++) {
                    totalConfirmed += Number(this.state.data[i]['attributes']['Confirmed']);
                    totalDeaths += Number(this.state.data[i]['attributes']['Deaths']);
                    totalRecovered += Number(this.state.data[i]['attributes']['Recovered']);
                }
                this.setState({
                    confirmed: numberWithSpaces(totalConfirmed),
                    deaths: numberWithSpaces(totalDeaths),
                    recovered: numberWithSpaces(totalRecovered),
                    countries: numberWithSpaces(totalCountries),
                    update: getLastUpdate(this.state.data),
                });
            });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.title}>EpiCOVID-19</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.subtitle}>Total Confirmed</Text>
                    <Text style={[styles.title, styles.red_color]}>{this.state.confirmed}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.subtitle}>Total Deaths</Text>
                    <Text style={styles.title}>{this.state.deaths}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.subtitle}>Total Recovered</Text>
                    <Text style={[styles.title, styles.green_color]}>{this.state.recovered}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.subtitle}>Total Countries</Text>
                    <Text style={[styles.title, styles.yellow_color]}>{this.state.countries}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.subtitle}>Last Update at</Text>
                    <Text style={styles.date}>{this.state.update}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000000',
        paddingVertical: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
    },
    date: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#FFF',
        // fontWeight: 'bold',
    },
    red_color: {
        color: '#e60000',
    },
    green_color: {
        color: '#70A800',
    },
    yellow_color: {
        color: '#F1A000',
    },
    box: {
        flex: 1,
        backgroundColor: '#222222',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        marginVertical: 10,
        borderRadius: 2,
        borderColor: '#363636',
        borderWidth: 1,
        paddingVertical: 10,
    },
});

export default Home;
