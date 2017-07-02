import React from 'react';
import TextField from 'material-ui/TextField';

class WeightSetting extends React.Component {

    defaultProps = {
        onBarWeightChange() {},
        onTargetWeightChange() {},
        barWeight: 20
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <h3>設定重量</h3>
                <TextField
                    hintText="KG"
                    type="number"
                    floatingLabelText="目標總重量"
                    onChange={this.props.onTargetWeightChange}/>
                <TextField
                    hintText="KG"
                    type="number"
                    floatingLabelText="槓重"
                    defaultValue={this.props.barWeight}
                    onChange={this.props.onBarWeightChange}/>
            </div>
        )
    }
}

export default WeightSetting;
