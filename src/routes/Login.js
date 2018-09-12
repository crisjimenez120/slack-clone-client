import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Button, Input, Container, Header } from 'semantic-ui-react';
import {gql, graphql} from 'react-apollo';


  class Login extends React.Component {
    constructor(props) {
      super(props);

      extendObservable(this, {
        email: '',
        password: '',
      });
    }

    onSubmit = async () => {
      const { email, password } = this;
      const response = await this.props.mutate({
        variables:{email, password}
      });
      const {ok, token, refreshToken} = response.data.login;
      if(ok){
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    };

    onChange = (e) => {
      const { name, value } = e.target;
      this[name] = value;
    };

    render() {
      const { email, password } = this;

      return (
        <Container text>
          <Header as="h2">Login</Header>
          <Form>
          <Form.Field>
          <Input 
            name="email" 
            onChange={this.onChange} 
            value={email} 
            placeholder="Email" 
            fluid 
            />
            </Form.Field>
            <Form.Field>
          <Input
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            placeholder="Password"
            fluid
          />
          </Form.Field>

          
          <Button onClick={this.onSubmit}>Submit</Button>
          </Form>
        </Container>
      );
    }
  }


const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(loginMutation)(observer(Login));
