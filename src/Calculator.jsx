import React from 'react';
import {
    cloneDeep,
    forEach,
    map,
    sum,
    filter,
    maxBy,
    find,
    sortBy,
    isEmpty,
    isEqual
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

        if (isEmpty(history.state)) {
            this.setState({
                totalPlatesWeight: this.calculatorSumOfPlatesWeight(this.state.plates)
            })
        } else {
            this.setState(history.state);
        }

    }

    componentDidUpdate = (prevProps, prevState) => {
        if (isEmpty(history.state)) {
            history.pushState(this.state, 'Bumper');
        } else if (!isEqual(prevState, this.state)) {
            history.replaceState(this.state, 'Bumper');
        }
    }

    calculatorSumOfPlatesWeight = (plates) => {
        var weight = 0;

        forEach(plates, (plate) => {
            weight += plate.weight * plate.stock
        });

        return weight;
    }

    renderSelecedPlates = () => {

        var targetWeight = this.state.targetWeight,
            barWeight = this.state.barWeight,
            leftWeight = targetWeight - barWeight,
            totalPlatesWeight = this.state.totalPlatesWeight,
            plates = cloneDeep(this.state.plates),
            isPlatesEnough = totalPlatesWeight >= leftWeight;

        if (targetWeight == 0) 
            return <div>請先設定目標重量</div>;
        
        if (!isPlatesEnough) 
            return <div>槓片不足</div>

        var pickPlates = this.pickPlates(leftWeight, plates);

        var result = map(pickPlates, (weight, index) => (
            <div key={`Plate_${weight}_${index}`}>
                {`${weight} x 2`}
            </div>
        ));

        var sumOfWeight = sum(pickPlates) * 2 + barWeight;

        result.unshift(
            <div key={`Plate_Sum`}>
                Total: {sumOfWeight}
            </div>
        );

        if (sumOfWeight < targetWeight) {
            result.push(
                <div key={`Plate_NoEnough`}>
                    {`Not Enought Weight for ${targetWeight - sumOfWeight} KG`}
                </div>
            );
        }

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

    handleTargetChange = value => {
        this.setState({targetWeight: Number(value)});
    };

    handleBarChange = event => {
        this.setState({
            barWeight: Number(event.target.value)
        });
    };

    handlePlateStockUpdate = (plateWeight, event) => {

        var plates = cloneDeep(this.state.plates);

        if (event.target.className == 'remove') {
            delete plates[plateWeight];
        } else {
            var selectedPlate = plates[plateWeight];
            selectedPlate.stock = selectedPlate.stock + 2 > 10
                ? 0
                : selectedPlate.stock + 2;
        }

        this.setState({plates: plates})
    }

    renderPlatesStock = (plates) => {

        plates = sortBy(plates, (p) => p.weight);

        return map(plates, (p) => {
            return (
                <div
                    key={`StockPlate_${p.weight}`}
                    style={{
                    'borderBottom': '1px solid #ddd',
                    padding: '5px'
                }}
                    onClick={this
                    .handlePlateStockUpdate
                    .bind(this, p.weight)}>
                    <span
                        className="remove"
                        style={{
                        float: 'right'
                    }}>
                        刪除
                    </span>
                    <span
                        style={{
                        display: 'inline-block',
                        width: '100px'
                    }}>{`${p.weight} KG`}</span>
                    <span
                        style={{
                        display: 'inline-block'
                    }}>{`Stock: ${p.stock}`}</span>

                </div>
            );
        })

    };

    handleCreatePlate = () => {

        if (isEmpty(this.newPlate) || this.newPlate.value <= 0) 
            return null;
        
        var plates = cloneDeep(this.state.plates);

        plates[this.newPlate.value] = {
            weight: Number(this.newPlate.value),
            stock: 2
        };

        this.setState({plates: plates})

    }

    render() {
        return (
            <div>
                <h3>設定重量</h3>
                <div className="input-group">
                    <label
                        style={{
                        display: 'block'
                    }}
                        htmlFor="BarWeight">槓重</label>
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
                    <label
                        style={{
                        display: 'block'
                    }}
                        htmlFor="TargetWeight">目標重量</label>
                    <input
                        type="number"
                        placeholder="重量"
                        name="target"
                        id="TargetWeight"
                        defaultValue={this.state.targetWeight}
                        onChange={event => this.handleTargetChange(event)}/>
                    <span>KG</span>
                </div>

                <hr/>

                <h3>參考槓片組合</h3>
                <div className="result">
                    {this.renderSelecedPlates()}
                </div>

                <hr/>

                <h3>槓片庫存</h3>
                <div>
                    {this.renderPlatesStock(this.state.plates)}
                </div>

                <hr/>

                <h3>新增槓片</h3>
                <div>
                    <div className="input-group">
                        <label htmlFor="NewPlateWeight">新槓片重</label>
                        <input
                            type="number"
                            placeholder="槓重"
                            name="newPlate"
                            ref={(input) => this.newPlate = input}
                            id="NewPlateWeight"
                            onKeyPress={(event) => {
                            console.log(event.target.key);
                            event.key == 'Enter'
                                ? this.handleCreatePlate()
                                : null
                        }}/>
                        <span>KG</span>
                    </div>
                    <input type="button" value="確定" onClick={this.handleCreatePlate}/>

                </div>
            </div>
        );
    }
}

export default Calculator;
