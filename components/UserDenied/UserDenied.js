import React from "react";
import {Button, Header, Container, Segment, Icon} from "semantic-ui-react";
import {Link} from "react-router";

const UserDenied = () => {
  return (
    <Container>
      <Link to="/">
        <Button>{`< Back`}</Button> </Link>
      <Segment size="large" textAlign="center">
        <Header as="h2" icon={true}>
          <Icon name="warning sign"/>
          User Denied Access
          <Header.Subheader>
            When a user denies access Starling will callback with an error code
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>
  );
};

export default UserDenied