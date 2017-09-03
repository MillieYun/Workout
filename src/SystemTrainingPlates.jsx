import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual, map, cloneDeep, sum} from 'lodash';
import PickPlatesHelper from './PickPlatesHelper.jsx';
import Plates from './Plates.jsx';
class SystemTrainingPlates extends Component {

  constructor(props) {

    super(props);

    var trainingWeightSet = this.getTrainingWeightSet(props.targetWeight);

    this.state = {
      trainingWeightSet: trainingWeightSet
    }
  }

  getWeight = (weight, multiplier) => {
    return Math.ceil(weight * multiplier);
  }

  getTrainingWeightSet = (targetWeight) => {

    var getWeight = this.getWeight;

    var result = [
      {
        rep: 5,
        targetWeight: getWeight(targetWeight, 0.5),
        seq: 1,
        type: 'warmUp'
      }, {
        rep: 3,
        targetWeight: getWeight(targetWeight, 0.7),
        seq: 2,
        type: 'warmUp'
      }, {
        rep: 2,
        targetWeight: getWeight(targetWeight, 0.9),
        seq: 3,
        type: 'warmUp'
      }, {
        rep: 5,
        targetWeight: getWeight(targetWeight, 1),
        seq: 4,
        type: 'training'
      }, {
        rep: 5,
        targetWeight: getWeight(targetWeight, 1),
        seq: 5,
        type: 'training'
      }, {
        rep: 8,
        targetWeight: getWeight(targetWeight, 1),
        seq: 6,
        type: 'training'
      }, {
        rep: 12,
        targetWeight: getWeight(targetWeight, 0.8),
        seq: 7,
        type: 'training'
      }
    ];

    return result;

  }

  componentWillUpdate(nextProps, nextState) {

    if (!isEqual(this.props, nextProps)) {
      this.setState({
        trainingWeightSet: this.getTrainingWeightSet(nextProps.targetWeight)
      })
    }

  }

  renderPlateSets = (weightSet) => {

    var {plates, barWeight, totalPlatesWeight} = this.props;

    var result = map(weightSet, (actionSet, index) => {

      var selectedPlates = PickPlatesHelper.getPlatesSet(barWeight, actionSet.targetWeight, cloneDeep(plates), totalPlatesWeight),
        sumOfWeight = sum(selectedPlates) * 2 + barWeight,
        isPlatesEnough = sumOfWeight >= actionSet.targetWeight;

      return (
        <div key={`set_${index}`}>
          <h4 style={{
            marginBottom: '0'
          }}>{`${actionSet.rep} reps - ${actionSet.targetWeight} KG`} {isPlatesEnough
              ? <span
                  style={{
                  fontSize: '80%',
                  color: '#ccc',
                  paddingLeft: 10
                }}>{`驗算: ${sumOfWeight}KG`}</span>
              : <span
                style={{
                fontSize: '80%',
                color: 'red',
                paddingLeft: 10
              }}>{`槓片不足 ${actionSet.targetWeight - sumOfWeight} KG, 尚需 ${ (actionSet.targetWeight - sumOfWeight) / 2} KG x 2`}</span>}
          </h4>

          <Plates selectedPlates={selectedPlates} isPlatesEnough={isPlatesEnough}/>
        </div>
      );
    });

    return result;
  }

  render() {

    var warmUpSet = this
        .state
        .trainingWeightSet
        .slice(0, 3),
      trainingSet = this
        .state
        .trainingWeightSet
        .slice(3, 7);

    return (
      <div>
        <header>暖身</header>
        <div className="panel-body">
          {this.renderPlateSets(warmUpSet)}
        </div>
        <header>訓練</header>
        <div className="panel-body">
          {this.renderPlateSets(trainingSet)}
        </div>
      </div>
    );
  }
}

SystemTrainingPlates.propTypes = {
  barWeight: PropTypes.number.isRequired,
  targetWeight: PropTypes.number.isRequired,
  totalPlatesWeight: PropTypes.number.isRequired,
  plates: PropTypes.object.isRequired
};

export default SystemTrainingPlates;