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

class PlateList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sumOfWeight: 0
        }
    }

    getPlatesSet = (barWeight, targetWeight, plates, totalPlatesWeight) => {

        var leftWeight = targetWeight - barWeight,
            plates = cloneDeep(this.props.plates),
            isPlatesEnough = totalPlatesWeight >= leftWeight;

        var pickPlates = this.pickPlates(leftWeight, plates);

        return pickPlates;

    }

    pickPlates = (leftWeight, plates) => {

        var pickPlates = [];

        while (leftWeight > 0) {
            var halfOfLeftWeight = leftWeight / 2;
            var usablePlates = filter(plates, (p) => p.weight <= halfOfLeftWeight && p.stock > 0);

            if (isEmpty(usablePlates)) {
                leftWeight = 0;
            } else {
                var selected = maxBy(usablePlates, (p, index) => p.weight);

                leftWeight -= selected.weight * 2;

                pickPlates.push(selected.weight);
                plates[selected.weight].stock -= 2;
            }
        }

        return pickPlates
    }

    componentWillUpdate = (nextProps, nextState) => {
        if (!isEqual(this.props, nextProps) && nextProps.targetWeight > 0) {

            var selectedPlates = this.getPlatesSet(nextProps.barWeight, nextProps.targetWeight, cloneDeep(nextProps.plates), nextProps.totalPlatesWeight),
                sumOfWeight = sum(selectedPlates) * 2 + nextProps.barWeight;

            this.setState({selectedPlates: selectedPlates, sumOfWeight: sumOfWeight});
        }
    }

    renderPlates = () => {

        if (this.props.targetWeight == 0) 
            return <div>請先設定目標重量</div>;
        
        var isPlatesEnough = (this.props.targetWeight - this.props.barWeight) <= this.props.totalPlatesWeight;

        if (!isPlatesEnough) 
            return <div>槓片不足</div>

        var selectedPlates = this.state.selectedPlates;

        var result = map(selectedPlates, (weight, index) => (
            <Chip style={{
                margin: 4
            }} key={`Plate_${index}`}>
                {`${weight} KG x 2`}
            </Chip>
        ));

        return result;
    }

    render() {

        var {sumOfWeight} = this.state;
        var {targetWeight} = this.props;

        return (
            <div>
                <h3>使用槓片組合</h3>
                {sumOfWeight > 0
                    ? (
                        <div>
                            {`實際總重量: ${sumOfWeight} KG`}
                        </div>
                    )
                    : null
}

                <br/>

                <div
                    style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
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

PlateList.defaultProps = {
    barWeight: 0,
    targetWeight: 0,
    plates: {}
}

export default PlateList;
