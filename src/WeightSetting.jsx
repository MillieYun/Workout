import React from 'react';
import TextField from 'material-ui/TextField';

class WeightSetting extends React.Component {

    defaultProps = {
        onBarWeightChange() {},
        onTargetWeightChange() {},
        barWeight: 20,
        targetWeight: 0
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <TextField
                    hintText="KG"
                    type="number"
                    floatingLabelText="目標總重量"
                    value={this.props.targetWeight == 0
                    ? ''
                    : this.props.targetWeight}
                    onChange={this.props.onTargetWeightChange}/>

                <TextField
                    hintText="KG"
                    type="number"
                    floatingLabelText="槓重"
                    value={this.props.barWeight == 0
                    ? ''
                    : this.props.barWeight}
                    onChange={this.props.onBarWeightChange}/>
            </div>
        )
    }
}

export default WeightSetting;
