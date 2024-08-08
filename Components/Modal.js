// // SimpleModal.js
// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// const SimpleModal = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.openButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.textStyle}>Show Modal</Text>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Hello, this is a modal!</Text>

//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Hide Modal</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   openButton: {
//     backgroundColor: '#F194FF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   closeButton: {
//     backgroundColor: '#2196F3',
//     borderRadius: 5,
//     padding: 10,
//     marginTop: 15,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default SimpleModal;
