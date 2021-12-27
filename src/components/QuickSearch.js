import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class QuickSearch extends Component {

    goToFilterPage = () => {
        this.props.history.push(`/filter?mealName=${this.props.title}&mealType=${this.props.mealType}`)
    }

    render() {
        const { imageSrc, title, description } = this.props;
        return (
            <React.Fragment>
                <div className="qs-box" onClick={this.goToFilterPage}>
                    <div className="qs-box-contents">
                        <img src={imageSrc} className="qs-image" alt="img"/>
                        <h4 className="qs-item-heading">{title}</h4>
                        <p className="qs-item-description">{description}</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(QuickSearch);
