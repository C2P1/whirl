import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  AsyncStorage,
  Button
} from 'react-native';

import { colors, fonts } from '../theme';
import Amplify, { Auth, API } from 'aws-amplify';

class ModalScreen extends Component {
  state = {
    todo: '',
    allTodo: [],
    modalVisible: false,
    backgroundSource:
      'https://source.unsplash.com/collection/1065412/900x1600/daily',
    User: ''
  };

  // replace with loading email from storage
  getEmail = (err, content) => {
    if (err) {
      console.log(err);
    } else {
      var email = content[3]['Value'];
      this.setState({
        User: email.replace('@', '.at.')
      });
    }
  };

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    user.getUserAttributes(this.getEmail);
    try {
      const value = await AsyncStorage.getItem('backgroundSource').then(
        keyvalue => {
          if (keyvalue !== null) {
            this.setState({
              backgroundSource: keyvalue
            });
            console.log(keyvalue);
          } else {
            console.log('TodoInput: no backgroundSource item in storage');
          }
        }
      );
    } catch (error) {
      console.log(
        'TodoInput: theres been an error getting the backgroundSource item'
      );
      console.log(error);
    }
  }

  /**
   * update the todo value in state as text is being inputted
   */
  onChangeText = value => {
    console.log(value);
    this.setState({
      todo: value
    });
  };

  /**
   * Add todo item to database
   */
  todoAddedHandler = () => {
    if (this.state.todo.trim() === '') return;

    this.saveNote();
    this.props.navigation.goBack();
    this.props.navigation.state.params.updateData();
  };

  // Create a new Note according to the columns we defined earlier
  saveNote() {
    var date = new Date();
    let newNote = {
      body: {
        Date: date.getTime(),
        Completed: 'false',
        User: this.state.User,
        Content: this.state.todo.trim()
      }
    };
    const path = '/Todo/';

    console.log(newNote.body.User);
    console.log(newNote.body.Content);
    console.log(newNote.body.Completed);
    console.log(newNote.body.Date);

    // Use the API module to save the note to the database
    try {
      const apiResponse = API.put('TodoCRUD', path, newNote);
      console.log('response from saving note: ' + JSON.stringify(apiResponse));
      this.setState({ apiResponse });
      console.log('modal screen api responses: ');
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.image}
          source={{ url: this.state.backgroundSource }}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                {/* close button in top left */}
                <TouchableHighlight
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.close}
                >
                  <Image
                    source={require('../assets/icons/cross.png')}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableHighlight>

                {/* Page title */}
                <Text style={styles.headerText}>Add a Todo</Text>

                {/* add button in top right */}
                <TouchableHighlight
                  onPress={() => {
                    // add the new focus
                    this.todoAddedHandler();
                  }}
                  style={styles.add}
                >
                  <Image
                    source={require('../assets/icons/tick.png')}
                    style={{ width: 50, height: 50 }}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.container}>
                <View style={styles.inputLineContainer}>
                  {/* use ref to textinput to open keyboard upon opening modal */}
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                    placeholder={'New Todo'}
                    placeholderTextColor="#ffffff"
                    onChangeText={value => this.onChangeText(value)}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    ref={input => {
                      this.textInput = input;
                    }}
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Add Todo"
                    onPress={() => {
                      // add the new focus
                      this.todoAddedHandler();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: 50
  },
  todoButton: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  todoInput: {
    marginTop: 7,
    marginLeft: 10,
    // marginBottom: 5,
    fontSize: 20,
    color: '#808080',
    textAlignVertical: 'top'
  },
  image: {
    flexGrow: 1,
    height: null,
    width: null
    // alignItems: 'center',
    // justifyContent:'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center'
  },
  headerText: {
    margin: 5,
    color: '#ffffff',
    // fontWeight: 'bold',
    fontSize: 30,
    fontFamily: fonts.light
  },
  close: {},
  add: {},
  body: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 0.2,
    borderColor: colors.primary
  },
  inputLineContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  button: {
    // flex: 1,
    // top: '-50%',
    justifyContent: 'center',
    alignItems: 'center'
    // margin: 60,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40
  },
  input: {
    color: '#ffffff',
    padding: 10,
    borderBottomWidth: 1.5,
    fontSize: 16,
    borderBottomColor: colors.primary,
    fontFamily: fonts.light,
    fontWeight: 'bold',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
});

export default ModalScreen;