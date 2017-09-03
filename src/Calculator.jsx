import './scss/form.scss';
import React from 'react';
import WeightSetting from './WeightSetting.jsx';
import SelectedPlates from './SelectedPlates.jsx';
import SystemTrainingPlates from './SystemTrainingPlates.jsx';
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
import {AppBar, TextField, RaisedButton} from 'material-ui';
import Checkbox from 'material-ui/Checkbox';

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
            barWeight: 35,
            totalPlatesWeight: 0,
            isSystemTraining: false,
            isStockOpen: false
        };

    };

    componentDidMount = () => {

        var storeKey = this.storeKey;

        if (isEmpty(localStorage.getItem(storeKey))) {
            this.setState({
                totalPlatesWeight: this.calculatorSumOfPlatesWeight(this.state.plates)
            })
        } else {
            var restore = JSON.parse(localStorage.getItem(storeKey));
            this.setState(restore);
        }

    }

    storeKey = 'Bumper';

    componentDidUpdate = (prevProps, prevState) => {

        var storeKey = this.storeKey;

        if (!isEqual(prevState, this.state)) {
            localStorage.setItem(storeKey, JSON.stringify(this.state));
        }
    }

    calculatorSumOfPlatesWeight = (plates) => {
        var weight = 0;

        forEach(plates, (plate) => {
            weight += plate.weight * plate.stock
        });

        return weight;
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

        this.setState({plates: plates});
    }

    renderPlatesStock = (plates) => {

        plates = sortBy(plates, (p) => p.weight);
        console.log(plates);

        return map(plates, (p) => {
            return (
                <div
                    key={`StockPlate_${p.weight}`}
                    className="list-item"
                    onClick={this
                    .handlePlateStockUpdate
                    .bind(this, p.weight)}>

                    <span className="remove">
                        刪除
                    </span>
                    <span className="plate-weight">{`${p.weight} KG`}</span>
                    <span>{`數量: ${p.stock}`}</span>

                </div>
            );
        })

    };

    handleCreatePlate = () => {

        if (isEmpty(this.newPlate) || this.newPlate.input.value <= 0) 
            return null;
        
        var plates = cloneDeep(this.state.plates),
            createPlateWeight = this.newPlate.input.value;

        plates[createPlateWeight] = {
            weight: Number(createPlateWeight),
            stock: 2
        };

        this.setState({plates: plates})

    }

    handleStockBlock = () => {
        this.setState({
            isStockOpen: !this.state.isStockOpen
        })
    }

    onCheckSystemTraining = (event, isChecked) => {
        this.setState({isSystemTraining: isChecked})
    }

    render() {

        var {
            barWeight,
            targetWeight,
            totalPlatesWeight,
            plates,
            isSystemTraining,
            isStockOpen
        } = this.state;

        return (
            <div className="container">
                <AppBar title="槓片計算機" showMenuIconButton={false}/>
                <div className="app-body">

                    <section className="panel">
                        <h3>設定重量</h3>

                        <WeightSetting
                            barWeight={barWeight}
                            targetWeight={targetWeight}
                            onBarWeightChange={this.handleBarChange}
                            onTargetWeightChange={this.handleTargetChange}/>

                        <Checkbox
                            label="使用 5 5 8 12"
                            checked={isSystemTraining}
                            onCheck={this.onCheckSystemTraining}/>

                    </section>
                    <section className="panel">
                        {isSystemTraining
                            ? <SystemTrainingPlates
                                    barWeight={barWeight}
                                    targetWeight={targetWeight}
                                    totalPlatesWeight={totalPlatesWeight}
                                    plates={plates}/>
                            : <SelectedPlates
                                barWeight={barWeight}
                                targetWeight={targetWeight}
                                totalPlatesWeight={totalPlatesWeight}
                                plates={plates}/>
}
                    </section>
                    <section className="panel"></section>
                    <section className={'panel'}>

                        <h3>槓片庫存
                            <span className="adjust" onClick={this.handleStockBlock}>調整庫存</span>
                        </h3>

                        <div
                            className={(isStockOpen
                            ? ' show'
                            : ' hide')}>
                            <div className={"list"}>
                                {this.renderPlatesStock(this.state.plates)}
                            </div>

                            <TextField
                                hintText="KG"
                                type="number"
                                ref={(input) => this.newPlate = input}
                                floatingLabelText="新槓片重"/>
                            <RaisedButton label="確定" primary={true} onTouchTap={this.handleCreatePlate}/>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Calculator;
