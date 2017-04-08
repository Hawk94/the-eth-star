import React from "react";
import URLSearchParams from "url-search-params";
import {Loader, Message, Button, Statistic, Grid, Container, Segment, Header, Image, Icon, Label} from 'semantic-ui-react'
import Dashboard from "../../../components/Dashboard/Dashboard";
import UserDenied from "../../../components/UserDenied/UserDenied"
import {Link} from 'react-router'
import './PersonalAccessView.scss'
import QuickTable from '../../../components/QuickTable';
import {transactionsProjection, transactionsSelection, transactionsWithTagsProjection, transactionsWithTagsSelection} from '../../../components/TransactionTable/TransactionTable';

class PersonalAccessView extends React.Component {

  static propTypes = {
    personalAccess: React.PropTypes.shape({
      transactions: React.PropTypes.array,
      customer: React.PropTypes.object,
      balance: React.PropTypes.object,
      transactionTags: React.PropTypes.object,
      tags: React.PropTypes.array,
      tagSuggestions: React.PropTypes.array
    }),
    loadTransactions: React.PropTypes.func.isRequired,
    loadBalance: React.PropTypes.func.isRequired,
    loadCustomer: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
    getTransactionsTags: React.PropTypes.func.isRequired,
    getTransactionTags: React.PropTypes.func.isRequired,
    addTransactionTag: React.PropTypes.func.isRequired,
    getTags: React.PropTypes.func.isRequired,
    getTagsLike: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.setLoading(true);
    this.props.loadTransactions();
    this.props.loadCustomer();
    this.props.loadBalance();

    this.props.getTransactionsTags();
    this.props.getTags();
  }

  componentWillUnmount () {
    window.location.href = ('/api/logout')
  }

  renderDashboard() {
    const {loading, transactions, balance, customer, transactionTags, tags, tagSuggestions} = this.props.personalAccess;
    if (balance && transactions && customer) {
      return <Dashboard
               mode={'Personal Access'}
              customer={customer}
              transactions={transactions}
              balance={balance}>
              { transactions.length
                ? <QuickTable
                    projection={transactionsWithTagsProjection}
                    selection={transactionsWithTagsSelection}
                    items={transactions}
                    context={{transactionTags, tags, tagSuggestions}} />
                : <p>No transactions on record.</p> }
      </Dashboard>;
    } else {
      return <Loading />;
    }
  }

  render () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const {loading, transactions, balance, customer, transactionTags, tags, tagSuggestions} = this.props.personalAccess;
    return (
      <Grid>
        <br/>
        {loading ? <Loading/> : this.renderDashboard() }
        {error && error === 'access_denied' ? <UserDenied/> : null}
      </Grid>
    )
  }
}

const Loading = () => {
  return (
    <Loader active size="large"/>
  );
};

// TODO - Not clear when to use this. Presumably if we get 400s back from server when requesting customer/balance/transactions.
//        Feels like we need richer redux store / app state to represent this scenario
const AnonymousProfile = () => {
  return (
    <Container>
      <Link to="/"><Button>{`< Back`}</Button> </Link>
      <Segment size="large" textAlign="center">
        <Header as="h2" icon={true}>
          <Icon name="warning sign"/>
          Access Denied
          <Header.Subheader>
            Check your personal access token in the server config is valid and try again.
          </Header.Subheader>
        </Header>
      </Segment>
    </Container>
  );
};

export default PersonalAccessView
