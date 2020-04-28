import React, {Component} from 'react';
import url from 'url';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getConfirmedCases(data) {
    var countries = [];
    for (var i = 0; i != data.length; i++) {
        var tmp = false;
        countries.forEach(item => {
            if (item.Country_Region === data[i]['attributes']['Country_Region']) {
                item.Confirmed = parseInt(item.Confirmed) + parseInt(data[i]['attributes']['Confirmed']);
                tmp = true;
            }
        });
        if (!tmp) countries.push(data[i]['attributes']);
    }
    countries = countries.sort(function(a, b) {
        return parseInt(b.Confirmed) - parseInt(a.Confirmed);
    });
    for (var j = 0; j < countries.length; j++) {
        countries[j].Confirmed = numberWithSpaces(countries[j].Confirmed);
    }
    return countries;
}

export class Confirmed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            cases: [],
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
                this.setState({
                    cases: getConfirmedCases(this.state.data),
                });
            });
    }

    render() {
        var mylist = [];
        for (let i = 0; i < this.state.cases.length; i++) {
            mylist.push(
                <View style={styles} key={i}>
                    <Text style={styles.line}>
                        <Text style={[styles.subtitle, styles.red_color]}>{this.state.cases[i]['Confirmed']} </Text>
                        <Text> </Text>
                        <Text style={styles.subtitle}> {this.state.cases[i]['Country_Region']}</Text>
                    </Text>
                </View>,
            );
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.box}>
                        <Text style={styles.title}>Confirmed Cases</Text>
                        {mylist}
                    </View>
                </ScrollView>
            </SafeAreaView>
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
    line: {
        textAlign: 'left',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderBottomColor: '#363636',
    },
    scrollView: {
        minWidth: '100%',
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    date: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 20,
        color: '#FFF',
        // fontWeight: 'bold',
    },
    red_color: {
        color: '#e60000',
        fontWeight: 'bold',
    },
    green_color: {
        color: '#70A800',
    },
    yellow_color: {
        color: '#F1A000',
    },
    box: {
        // flex: 1,
        backgroundColor: '#222222',
        justifyContent: 'center',
        // width: '100%',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 2,
        borderColor: '#363636',
        borderWidth: 1,
        paddingVertical: 10,
    },
});

export default Confirmed;
