import { connect } from 'react-redux';

import Actions from '../actions';
import ProductsAPI from '../apis/products';
import TaxonAPI from '../apis/taxons';
import HomePage from '../components/home-page';

const mapStateToProps = (state, ownProps) => {
  return {
    products: state.products,
    displayLoader: state.displayLoader
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerInitialSetup: () => {
      dispatch (Actions.displayLoader());
      let fetchedTaxons = null;
      let taxon_id = null;
      let taxon_link = location.pathname.match(/^\/t\/(.+)/)
      TaxonAPI.getList().then((response) => {
        fetchedTaxons = JSON.parse(response.text).taxons;
        dispatch (Actions.addTaxons(fetchedTaxons));
        return fetchedTaxons
      }).then((response) => {
        if(taxon_link){
          taxon_id = () => {
            for (var i = 0; i < response.length; i++) {
              if(response[i].root.permalink === taxon_link[1]){
                return response[i].root.id;
              } else {
                for (var j = 0; j < response[i].root.taxons.length; j++) {
                  if(response[i].root.taxons[j].permalink === taxon_link[1]){
                    return response[i].root.taxons[j].id;
                  }
                };
              }
            };
          }
          ProductsAPI.getCategorizedList(taxon_id()).then((response) => {
            let fetchedProducts = JSON.parse(response.text).products;

            dispatch (Actions.addProducts(fetchedProducts));
            dispatch (Actions.hideLoader())
          });
        } else {
          ProductsAPI.getList().then((response) => {
            let fetchedProducts = JSON.parse(response.text).products;

            dispatch (Actions.addProducts(fetchedProducts));
            dispatch (Actions.hideLoader())
          });
        }
      });

    }
  };
};

const HomePageConnector = connect(mapStateToProps, mapDispatchToProps)(HomePage);

export default HomePageConnector;
