import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isEqual, map, cloneDeep} from 'lodash';
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

  renderWarmUpSet = (weightSet) => {

    var weightSet = this.state.trainingWeightSet;
    var {plates, barWeight, totalPlatesWeight} = this.props;

    var result = map(weightSet, (set, index) => {

      var selectedPlates = PickPlatesHelper.getPlatesSet(barWeight, set.targetWeight, cloneDeep(plates), totalPlatesWeight);

      console.log(`${index}: `, selectedPlates)

      var style = (index != 0 && index != (weightSet.length - 1)) && set.type != weightSet[index + 1].type
        ? {
          borderBottom: '1px solid #ccc',
          paddingBottom: 16
        }
        : {};

      return (
        <div key={`set_${index}`} style={style}>
          <h3>{`${set.rep} - ${set.targetWeight} KG`}</h3>
          <Plates
            selectedPlates={selectedPlates}
            isPlatesEnough=
            { (set.targetWeight - barWeight) <= totalPlatesWeight }/>
        </div>
      );
    });

    return result;
  }

  renderTrainingSet = () => {}

  render() {
    return (
      <div>
        <div>
          <h3>Warm Up</h3>
          {this.renderWarmUpSet(this.state.trainingWeightSet)}
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