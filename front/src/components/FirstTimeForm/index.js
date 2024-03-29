// == Import : npm
import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import Axios from 'axios';
import Code from './code';
import Player from './player';
import store from 'src/store';
import { setPlayer, mercureSubscribeSteps, setGameId, waitingAjax, stopWaitingAjax, getGameData } from 'src/store/reducer';

class FirstTimeForm extends Component {
    state = {
      step: 1,
      code: '',
      name: ''
    }

    handleChange = (event) => {
      const { name, value } = event.target;

      this.setState({
        [name]: value
      });
    }


    nextStep = () => {
      this.setState({
        step: this.state.step + 1
      });
    }

    submitForm = (event) => {
      event.preventDefault();
      const { code, name } = this.state;
      store.dispatch(waitingAjax());
      Axios.post(process.env.API_DOMAIN + "login", {
        code: code,
        name: name
      })
        .then((response) => {

          const { token, id, playerId} = response.data;
          localStorage.setItem('token', token);
          const player = {
            token,
            name,
            playerId,
            gameCode: code,
            gameId: id,
          };

          const action = setPlayer(player);
          store.dispatch(action);
          store.dispatch(setGameId(id));
          store.dispatch(getGameData());
          // store.dispatch(mercureSubscribeSteps());
          // store.dispatch(waiting());

        })
        .catch((error) => {
          if (error.response?.data.errors) {
            const { errors } = error.response.data;
            for (const error in errors) {
              toastr.error(errors[error]);
            }
          }

        }).finally(() => {
          store.dispatch(stopWaitingAjax());
        });
    }

    render() {
      const { code, name } = this.state;
      switch (this.state.step) {
        case 1:
        default:
          return (
            <Code
              code={code}
              handleChange={this.handleChange}
              nextStep={this.nextStep}
            />
          );
        case 2:
          return (
            <Player
              code={code}
              name={name}
              handleChange={this.handleChange}
              submitForm={this.submitForm}
            />
          );
      }
    }
}
// == Export 
export default FirstTimeForm;
