import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import HomeScreen from './screens/home.js';
import ConfirmedScreen from './screens/confirmed.js';
import DeathsScreen from './screens/deaths.js';
import RecoveredScreen from './screens/recovered.js';
import {Icon} from 'react-native-elements';

const Tab = createBottomTabNavigator(
    {
        Home: {screen: HomeScreen},
        Confirmed: {screen: ConfirmedScreen},
        Deaths: {screen: DeathsScreen},
        Recovered: {screen: RecoveredScreen},
    },
    {
        // defaultNavigationOptions: ({navigation}) => ({
        //     tabBarIcon: ({focused, horizontal, tintColor}) => {
        //         const {routeName} = navigation.state;
        //         if (routeName === 'Home') {
        //             return <Icon name="rowing" />;
        //         } else {
        //         }
        //     },
        // }),
        tabBarOptions: {
            activeTintColor: '#F1A000',
            inactiveTintColor: '#FFF',
            activeBackgroundColor: '#222',
            inactiveBackgroundColor: '#222',
        },
    },
);

export default createAppContainer(Tab);
