import React, { Component } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

/*  Constant Files */
import { Colors } from './Colors';
import { ConstantKey } from './ConstantKey';
import { FontSize } from './FontSize';

export default class LoadingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.indicatorView}>

                    <ActivityIndicator size={'large'} color={Colors.primary} />
                    {this.props.text !== '' && this.props.text !== undefined ?
                        <Text style={styles.text} numberOfLines={2}>
                            {this.props.text}
                        </Text>
                        : null}
                </View>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: '100%', width: '100%', backgroundColor: Colors.black03, alignItems: 'center', justifyContent: 'center', position: 'absolute'
    },
    indicatorView: {
        borderRadius: 6, shadowColor: Colors.black03, backgroundColor: Colors.white,
        justifyContent: 'center', alignItems: 'center', padding: 25,
        shadowOffset: { width: 0, height: 2 }, maxWidth: 150, maxHeight: 150,
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5
    },
    text: {
        margin: 5, fontSize: FontSize.FS_14, color: Colors.black, fontFamily : ConstantKey.MONTS_REGULAR
    }
})