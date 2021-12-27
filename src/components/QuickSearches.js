import React, { Component } from 'react'
import QuickSearch from './QuickSearch'

export default class QuickSearches extends Component {
    render() {
        const { qsData } = this.props;
        return (
            <React.Fragment>
                <div className="bottomSection">
                    <h1 className="qs-heading">Quick Searches</h1>
                    <h3 className="qs-subheading">Discover restaurants by type of meal</h3>
                    <div className="qs-boxes-container">
                        {
                            qsData.map((item, index) => {
                                return (
                                    <QuickSearch key={index} imageSrc={require(`../${item.image}`).default} title={item.name} description={item.content} mealType={item.meal_type} />
                                )
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
