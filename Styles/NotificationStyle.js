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
      color: '#2D6D4B',
    },
    dropdownContainer: {
      marginBottom: 60,
      width: '80%',
      alignSelf: 'center',
    },
    dropdown: {
      backgroundColor: '#ffffff',
      borderColor: '#20604F',
    },
    dropdownContainerStyle: {
      backgroundColor: '#A8D8B9',  // for the dropdown list
    },
    textStyle: {
      color: '#36563C',
      fontSize: 16,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto',
    },
    placeholderStyle: {
      color: '#ffffff', 
      fontSize: 16,
    },
    labelStyle: {
      color: '#00896C', 
      fontSize: 16,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'Roboto', 
    },
    selectedItemLabelStyle: {
      color: '#096148',
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
    notificationContainer: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#1C5D3A', 
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25, 
      width: '80%',
      marginBottom: 5,
      marginTop: 5,
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
      backgroundColor: '#00896C',  
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25, 
      width: '80%',
      alignSelf: 'center',
      marginTop: 10,
    },
    confirmButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
