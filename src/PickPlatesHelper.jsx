import {cloneDeep, filter, isEmpty, maxBy} from 'lodash';

class PickPlatesHelper {

  getPlatesSet = (barWeight, targetWeight, plates, totalPlatesWeight) => {

    var leftWeight = targetWeight - barWeight,
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

};

export default new PickPlatesHelper();