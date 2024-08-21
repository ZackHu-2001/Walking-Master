import { FAB } from 'react-native-paper';
import React from 'react';

const FloatingActionButton = ({ addNewGame, addRoom, editRoom }) => {
  const [open, setOpen] = React.useState(false);
  const onStateChange = ({ open }) => setOpen(open);

  return (
    <FAB.Group
      open={open}
      style={{ paddingBottom: 50, paddingRight: 10, zIndex: 2 }}
      visible
      icon={open ? 'close' : 'plus'}
      actions={[
        {
          icon: 'square-edit-outline',
          label: 'Edit Route',
          onPress: () => editRoom(),
        },
        {
          icon: 'star',
          label: 'Join Route',
          onPress: () => addRoom(),
        },
        {
          icon: 'plus',
          label: 'New Route',
          onPress: () => addNewGame(),
        },
      ]}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  )
}

export default FloatingActionButton;
