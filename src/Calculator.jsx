import React from 'react';
import {
    cloneDeep,
    forEach,
    map,
    sum,
    filter,
    maxBy,
    find,
    isEmpty
} from 'lodash';

class Calculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plates: {
                '0.5': {
                    weight: 0.5,
                    stock: 4
                },
                '1': {
                    weight: 1,
                    stock: 2
                },
                '1.25': {
                    weight: 1.25,
                    stock: 2
                },
                '1.5': {
                    weight: 1.5,
                    stock: 2
                },
                '2': {
                    weight: 2,
                    stock: 2
                },
                '2.5': {
                    weight: 2.5,
                    stock: 4
                },
                '5': {
                    weight: 5,
                    stock: 4
                },
                '10': {
                    weight: 10,
                    stock: 4
                }
            },
            targetWeight: 0,
            barWeight: 20,
            totalPlatesWeight: 0
        };
    };

    componentDidMount = () => {
        this.setState({
            totalPlatesWeight: this.calculatorSumOfPlatesWeight(this.state.plates)
        })
    }

    calculatorSumOfPlatesWeight = (plates) => {
        var weight = 0;

        forEach(plates, (plate) => {
            weight += plate.weight * plate.stock
        });

        return weight;
    }

    renderPlates = () => {

        var targetWeight = this.state.targetWeight,
            barWeight = this.state.barWeight,
            leftWeight = targetWeight - barWeight,
            totalPlatesWeight = this.state.totalPlatesWeight,
            plates = cloneDeep(this.state.plates),
            isPlatesEnough = totalPlatesWeight >= leftWeight;

        if (this.state.targetWeight == 0) 
            return <div>Please setting your target weight</div>;
        
        if (!isPlatesEnough) 
            return <div>Not Enough Plates</div>

        var pickPlates = this.pickPlates(leftWeight, plates);

        var result = map(pickPlates, (weight, index) => (
            <div key={`Plate_${weight}_${index}`}>
                {weight}
                x 2
            </div>
        ));

        result.push(
            <div key={`Plate_Sum`}>
                Total: {sum(pickPlates) * 2 + barWeight}
            </div>
        )

        return result;

    };

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

    handleTargetChange = event => {
        this.setState({
            targetWeight: Number(event.target.value)
        });
    };

    handleBarChange = event => {
        this.setState({
            barWeight: Number(event.target.value)
        });
    };

    render() {
        return (
            <div>
                <div className="input-group">
                    <label htmlFor="BarWeight">槓重</label>
                    <input
                        type="number"
                        placeholder="槓重"
                        name="bar"
                        id="BarWeight"
                        defaultValue={this.state.barWeight}
                        onChange={event => this.handleBarChange(event)}/>
                    <span>KG</span>
                </div>
                <div className="input-group">
                    <label htmlFor="TargetWeight">目標重量</label>
                    <input
                        type="number"
                        placeholder="重量"
                        name="target"
                        id="TargetWeight"
                        onChange={event => this.handleTargetChange(event)}/>
                    <span>KG</span>
                </div>
                <div className="setting">
                    Bar Weight: {this.state.barWeight},
                    <br/>
                    TargetWeight: {this.state.targetWeight}
                </div>
                <hr/>
                <div className="result">
                    {this.renderPlates()}
                </div>
            </div>
        );
    }
}

export default Calculator;
