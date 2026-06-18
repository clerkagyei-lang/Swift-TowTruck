import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface LocationSearchInputProps {
  placeholder: string;
  onLocationSelect: (data: { address: string; latitude: number; longitude: number }) => void;
  apiKey: string;
}

export function LocationSearchInput({ placeholder, onLocationSelect, apiKey }: LocationSearchInputProps) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails={true} // Crucial: gives us the actual lat/lng coordinates
        onPress={(data, details = null) => {
          if (details && details.geometry) {
            onLocationSelect({
              address: data.description,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }
        }}
        query={{
          key: apiKey,
          language: 'en',
          components: 'country:us', // Limits searches to USA (remove or change if operating globally)
        }}
        styles={{
          textInputContainer: styles.inputContainer,
          textInput: styles.input,
          listView: styles.dropdownList,
          row: styles.dropdownRow,
          description: styles.dropdownText,
        }}
        enablePoweredByContainer={false} // Hides the powered by Google logo to clean up the UI
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 999, // Guarantees the dropdown drops down over your maps/buttons
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  input: {
    height: 48,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  dropdownRow: {
    padding: 13,
    height: 50,
  },
  dropdownText: {
    fontSize: 14,
    color: '#4A5568',
  },
});
