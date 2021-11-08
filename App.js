/* eslint-disable quotes */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
} from 'react-native';
import SearchBar from 'react-native-search-bar';

import MapboxGL, {MapView, Camera} from '@react-native-mapbox-gl/maps';
const axios = require('axios').default;

// ! update access token
const ACCESS_TOKEN =
  'pk.eyJ1IjoiYnVkZHljbyIsImEiOiJja3ZxOGc0OHJkZnlzMnd0OW5zdmM4aWJiIn0.amOqwlfrEQ2rVzsByIU3Jw';

MapboxGL.setAccessToken(ACCESS_TOKEN);

// hard coded user location
const USER_LONGITUDE = 40.72373;
const USER_LATITUDE = -74.00143;

const App = () => {
  const [search, setSearch] = useState('');
  const searchBarRef = useRef();

  const [displayResults, setDisplayResults] = useState(false);
  const [results, setResults] = useState([]);

  // search bar text handler
  const handleSearch = async text => {
    const searchParam = encodeURI(text);
    fetchData(searchParam);
  };

  const fetchData = async searchParam => {
    const params = {
      access_token: ACCESS_TOKEN,
      autocomplete: true,
      // search result bias based on user location
      // not 100% impressive -> "Central -> 1st result is Central Java, Indonesia vs. Central Park "
      proximity: `${USER_LATITUDE},${USER_LONGITUDE}`,
    };
    const timeout = 1000;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchParam}.json`;

    // await axios(url, {params}, timeout)
    await axios(url, {params}, timeout)
      .then(res => res.data.features)
      .then(data => {
        console.log(data);
        setDisplayResults(true);
        setResults(data);
      })
      .catch(err => console.log(err.message));
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView style={styles.map}>
          <Camera
            centerCoordinate={[USER_LATITUDE, USER_LONGITUDE]}
            zoomLevel={13}
          />
        </MapView>
        <View style={styles.searchContainer}>
          <SearchBar
            text={search}
            onChangeText={setSearch}
            onChange={e => handleSearch(e.nativeEvent.text)}
            onPress={() => searchBarRef.current.focus()}
            ref={searchBarRef}
            placeholder="Search"
            hideBackground={true}
            onCancelButtonPress={() => setDisplayResults(false)}
            style={styles.searchBar}
          />
          {displayResults && (
            <FlatList
              // style={styles.flatList}
              data={results}
              keyExtractor={i => i.id.toString()}
              renderItem={({item}) => (
                <Text style={styles.searchItem}>{item.place_name}</Text>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  searchBar: {
    width: '100%',
    height: 60,
  },
  searchItem: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginHorizontal: 6,
    fontSize: 14,
    backgroundColor: 'rgba(225, 255, 225, 0.8)',
    flexWrap: 'wrap',
    // borderWidth: 1,
  },
  flatList: {
    // alignSelf: 'flex-end',
    flex: 1,
    // height: 100,
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    width: '100%',
    // height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default App;
