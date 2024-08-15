# Walking-Master

## Team member:
Hanzhang Peng, Zixiang Hu

### Functionalities added in this iteration:
 - Authentication
    - Support login, logout, signup, findback password
    - User could only see its own created content(game).
- Camera Use
    - Permissions are required when first use it.
    - Support chose image from lib or take image, then upload to server and display locally.
- Notification use
    - User could schedule local notification

## Note: We did not achieved authentication through rules, but through validation with in the program, only userid matched with the provided would display the relevant content.
### FireStore Rules
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 9, 5);
    }
  }
}
```

### Storage Rules
```
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {

    // This rule allows anyone with your Storage bucket reference to view, edit,
    // and delete all data in your Storage bucket. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Storage bucket will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Storage bucket will be denied until you Update
    // your rules
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2024, 9, 5);
    }
  }
}
```
### Components / Screen that we work on
Hanzhang Peng:
- Login screen
- Signup screen
- Profile screen
- Notification screen
- CustomButton
- Bottom navigator

Zixiang Hu:
- Game screen
- Create game screen
- Game board screen
- Tile
- Modal
- GameCard

### Data Model & Collection
![data modal](/assets/dataModel.png)

### CRUD
For each of the collection, there are three basic CRUD operation, create, read and update.
Delete is only supported for the game collection. Furthermore, for game colleciton, we had an extra function that keeps listening its update. The detailed implementation could be found from firestoreHelper.js.

## Screen shots

![](/assets/IMG_7663.PNG)
![](/assets/IMG_7664.PNG)
![](/assets/IMG_7665.PNG)
![](/assets/IMG_7662.PNG)
![](/assets/IMG_7660.PNG)
![](/assets/IMG_7661.PNG)
![](/assets/IMG_7658.PNG)

![](/assets/IMG_7657.PNG)
![](/assets/IMG_7656.PNG)

![](/assets/IMG_7666.PNG)


## Note:
It is possible to unable create new game, due to some authentication issue(because we are downloding image from other source). If you met that, don't hesitate to contact me, and I would help you out.
