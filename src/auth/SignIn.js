import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  ImageBackground,
  Alert
} from 'react-native';

import { Auth } from 'aws-amplify'
import { connect } from 'react-redux'

import { authenticate, confirmUserLogin } from '../actions'
import { fonts, colors } from '../theme'

import Input from '../components/Input'
import Button from '../components/Button'

class SignIn extends Component {
  state = {
    username: '',
    password: '',
    accessCode: '',
    greetingText: 'day',
    source: '',
    loading: true,
  }

  componentDidMount() {
    this.setState({
      greetingText: this.getGreeting(),
      // source: {url: 'https://source.unsplash.com/900x600/daily?nature'}
    })
  }
  
  getGreeting() {
    var date = new Date();
    var hour = date.getHours();
    if (hour > 17) {
      return 'evening';
    } else if (hour > 11) {
      return 'afternoon';
    } else {
      return 'morning';
    }
  }
  
  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  signIn() {
    const { username, password } = this.state
    this.props.dispatchAuthenticate(username, password)
  }

  confirm() {
    const { authCode } = this.state
    this.props.dispatchConfirmUserLogin(authCode)
  }

  
  render() {
    const { fontsLoaded } = this.state
    const { auth: {
      signInErrorMessage,
      isAuthenticating,
      signInError,
      showSignInConfirmationModal
    }} = this.props
    return (
      <ImageBackground
          style={styles.image}
          // source={{url: 'https://source.unsplash.com/900x600/daily?nature'}}
          source = {require('../assets/DefaultBackground2.jpeg')}
          // source = {{url: 'https://images.unsplash.com/collections/1065412/1600x900'}}
          // source = {{url: 'https://source.unsplash.com/collection/1065412/900x1600/daily'}}
          // source = {require('../assets/DefaultBackground.jpg')}
          // source = {this.state.source}
          imageStyle={{resizeMode: 'cover'}}
          onLoadEnd={ ()=>{ this.setState({ loading: false })}}
      >
      <ActivityIndicator animating={ this.state.loading } size="large"/>
      <View style={styles.container}>
        <Text style={[styles.greeting]}>
          Good {this.state.greetingText}
        </Text>
        <Text style={[styles.greeting2]}>
          Sign in to continue
        </Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email Address"
            placeholderTextColor="#000000"
            type='username'
            onChangeText={this.onChangeText}
            value={this.state.username}
          />
          <Input
            placeholder="Password"
            placeholderTextColor="#000000"
            type='password'
            onChangeText={this.onChangeText}
            value={this.state.password}
            secureTextEntry
          />
        </View>
        <Button
          isLoading={isAuthenticating}
          title='Sign In'
          onPress={this.signIn.bind(this)}
        />  
        {/* <View style={{ flex: 0.1, backgroundColor: 'blue'}}>
        <TouchableOpacity style={{marginTop: 10, flex: 0}}>
          <Text style={{fontSize: 22, fontWeight: 'bold', color: colors.primary, fontFamily: fonts.light}}>Sign In</Text>
        </TouchableOpacity>    
        </View> */}

        <Text style={[styles.errorMessage, signInError && { color: '#FF0000', fontWeight: 'bold'}]}>Error logging in. Please try again.</Text>
        <Text style={[styles.errorMessage, signInError && { color: '#FF0000', fontWeight: 'bold'}]}>{signInErrorMessage}</Text>
        {
          showSignInConfirmationModal && (
            <Modal>
              <View style={styles.modal}>
                <Input
                  placeholder="Authorization Code"
                  type='authCode'
                  keyboardType='numeric'
                  onChangeText={this.onChangeText}
                  value={this.state.authCode}
                  keyboardType='numeric'
                />
                <Button
                  title='Confirm'
                  onPress={this.confirm.bind(this)}
                  isLoading={isAuthenticating}
                />
              </View>
            </Modal>
          )
        }
      </View>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = {
  dispatchConfirmUserLogin: authCode => confirmUserLogin(authCode),
  dispatchAuthenticate: (username, password) => authenticate(username, password)
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    flexDirection: 'row'
  },
  errorMessageView: {
    fontSize: 12,
    marginTop: 10,
    color: 'transparent',
    fontFamily: fonts.base,
  },
  errorMessage: {
    fontSize: 12,
    // marginTop: 10,
    color: 'transparent',
    fontFamily: fonts.base,
  },
  inputContainer: {
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    top: -25
  },
  greeting: {
    fontWeight: '300',
    marginTop: 20,
    fontSize: 31,
    fontFamily: fonts.light
  },
  greeting2: {
    color: '#666',
    fontSize: 24,
    marginTop: 5,
    fontFamily: fonts.light
  },
  image: {
    flexGrow:1,
    height: null,
    width:null,
    alignItems: 'stretch',
  },
});