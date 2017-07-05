import React from 'react';
import Chip from 'material-ui/Chip';
import {isEmpty, map} from 'lodash';

class Plates extends React.Component {

    defaultProps = {
        selectedPlates: [],
        isPlatesEnough: true
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        if (isEmpty(this.props.selectedPlates)) 
            return null;
        
        if (!this.props.isPlatesEnough) 
            return <div>槓片不足</div>;
        
        var selectedPlates = this.props.selectedPlates;

        var result = map(selectedPlates, (weight, index) => (
            <Chip style={{
                margin: 4
            }} key={`Plate_${index}`}>
                {`${weight} KG x 2`}
            </Chip>
        ));

        return (
            <div
                style={{
                display: 'flex',
                flexWrap: 'wrap'
            }}>{result}</div>
        )
    }
}

export default Plates;