import { StyleSheet, Platform } from 'react-native';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    titleContainer: {
      width: '80%',
      alignSelf: 'center',
      marginBottom: 20, 
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#6A4C9C',
    },
    dropdownContainer: {
      marginBottom: 60,
      width: '80%',
      alignSelf: 'center',
    },
    dropdown: {
      backgroundColor: '#ffffff',
      borderColor: '#7B90D2',
    },
    dropdownContainerStyle: {
      backgroundColor: '#e5e5ff',  // for the dropdown list
    },
    textStyle: {
      color: '#333333',
      fontSize: 16,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
    },
    placeholderStyle: {
      color: '#999999', 
      fontSize: 16,
    },
    labelStyle: {
      color: '#4E4F97', 
      fontSize: 16,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto', 
    },
    selectedItemLabelStyle: {
      color: '#6A4C9C',
      fontWeight: 'bold',
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
    },
    dateTimeContainer: {
      marginBottom: 30,
      alignItems: 'center',
    },
    buttonContainer: {
      alignItems: 'center',
    },
    dateTimePicker: {
      width: '100%',
    },
    button: {
      backgroundColor: '#6A4C9C', 
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25, 
      width: '80%',
      marginBottom: 5,
    },
    buttonText: {
      color: '#ffffff',  
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    selectedText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
      weights: 'bold',
    },    
    confirmButton: {
      backgroundColor: '#993399',  
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25, 
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
    },
    confirmButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
