import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import React, {
    Component,
    StyleSheet,
    Text,
    View,
    PropTypes,
} from 'react-native';

import {
    Page,
    Pages,
    InitPage,
    MainPage
} from '../components';

import * as menuActionCreators from '../actions/menu';
import * as pageActionCreators from '../actions/page';
import * as userActionCreators from '../actions/user';

import * as staticStore from '../static';

class App extends Component {
    componentWillMount(){

    }
    render() {
        let { doorlock } = this.props

        return (
            <View>
                <Pages currentPageID = {doorlock.getIn(['page', 'currentPageID'])}>
                    <Page id={staticStore.pages.loadingPage.id}>
                        <LoadingPage title={staticStore.title} />
                    </Page>
                    <Page id={staticStore.pages.initPage.id}>
                        <InitPage title={staticStore.title} onRegister={userActions.register} />
                    </Page>
                    <Page id={staticStore.pages.mainPage.id}>
                        <MainPage title={staticStore.title} onUnlock={userActions.unregister} onOpenMenu={userActions.unregister} />
                    </Page>
                </Pages>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        doorlock: state.get('doorlock')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        menuActions: bindActionCreators(menuActionCreators, dispatch),
        pageActions: bindActionCreators(pageActionCreators, dispatch),
        userActions: bindActionCreators(userActionCreators, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);