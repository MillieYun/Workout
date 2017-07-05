import React from 'react';
import {
    cloneDeep,
    filter,
    isEmpty,
    maxBy,
    map,
    sum,
    isEqual
} from 'lodash';
import {Chip} from 'material-ui';
import PickPlatesHelper from './PickPlatesHelper.jsx';
import Plates from './Plates.jsx';

class SelectedPlates extends React.Component {

    constructor(props) {
        super(props);

        var {barWeight, targetWeight, plates, totalPlatesWeight} = this.props;

        var result = this.getSelectedPlates(barWeight, targetWeight, cloneDeep(plates), totalPlatesWeight);

        this.state = {
            sumOfWeight: result.sumOfWeight,
            selectedPlates: result.selectedPlates
        }
    }

    getSelectedPlates = (barWeight, targetWeight, plates, totalPlatesWeight) => {
        var selectedPlates = PickPlatesHelper.getPlatesSet(barWeight, targetWeight, cloneDeep(plates), totalPlatesWeight);
        var sumOfWeight = sum(selectedPlates) * 2 + barWeight;

        return {
            selectedPlates: selectedPlates,
            sumOfWeight: sumOfWeight || 0
        }
    }

    componentWillUpdate = (nextProps, nextState) => {

        if (!isEqual(this.props, nextProps) && nextProps.targetWeight > 0) {

            var {barWeight, targetWeight, plates, totalPlatesWeight} = nextProps;

            var result = this.getSelectedPlates(barWeight, targetWeight, cloneDeep(plates), totalPlatesWeight);

            this.setState({sumOfWeight: result.sumOfWeight, selectedPlates: result.selectedPlates});
        }

    }

    renderPlates = () => {

        if (this.props.targetWeight == 0) 
            return <div>請先設定目標重量</div>;
        
        return <Plates
            selectedPlates={this.state.selectedPlates}
            isPlatesEnough={(this.props.targetWeight - this.props.barWeight) <= this.props.totalPlatesWeight}/>

    }

    render() {

        var {sumOfWeight} = this.state;
        var {targetWeight} = this.props;

        return (
            <div>

                <h3 style={{
                    marginBottom: 8
                }}>使用槓片組合
                    <span
                        style={{
                        fontSize: '80%',
                        paddingLeft: 16,
                        color: '#ccc'
                    }}>
                        {`驗算: ${sumOfWeight} KG`}
                    </span>
                </h3>

                <div>
                    {this.renderPlates()}
                </div>

                {(targetWeight > sumOfWeight)
                    ? (
                        <div>
                            {`槓片不足 ${targetWeight - sumOfWeight} KG`}
                        </div>
                    )
                    : null
}
            </div>
        )
    }
}

SelectedPlates.defaultProps = {
    barWeight: 0,
    targetWeight: 0,
    plates: {}
}

export default SelectedPlates;
