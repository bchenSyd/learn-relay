# why my *pendingVariables* is null?
1. `searchContainer` called `setVarialbes()` so `seacherContainer` should do `pendingVariables i.e. isloading` check
   > i.e. whoever initiates the query should do the `pendingVarialbes` check
2. `searchContainer` called `setVarialbes()` so `<SearchContainer viewer={viewer} status={newStatus} relay={props.relay} />` is required
   > if you ommit passing `relay={props.relay}`, you get the same result as you observed in `BetReceiptsHolder.tsx`

  ```javascript
// pass an extra `relay={relay}` makes a huge difference in BetReceiptsHolder
// without `relay={relay}`, BetReceiptsHolder only get rendered once, after query resolves; no `pendingVarialbes` available
// with    `relay={relay}`, you have full access to `pendingVarialbes`
class FKBetSlipTemplate extends React.Component<IBetSlipTemplateProps & IContainerProps>{

  render(){
  const {relay, relay: {variables: {openBetsRefreshTimes}, pendingVariables}} = this.props;
  const isLoading = !!pendingVariables;
  return <div>
            {isLoading ? <FKLoadingTemplate />
            : <div>
              {showOpenBets && < OpenBetCardsHolder viewer={viewer} isAuthenticated={isAuthenticated} openBetsRefreshTimes={openBetsRefreshTimes} />}
              {!showOpenBets && (showReceipt ? <BetReceiptsHolder viewer={viewer} serverSideReceiptNumber={serverSideReceiptNumber} relay={relay}/>
                                             : <BetSlipCardsHolder viewer={viewer} isAuthenticated={isAuthenticated} />)}}
              </div>
            }
      </div>
  }
}

export default Relay.createcontainer( FKBetSlipTemplate,{
    initialVariables: {
        showBetSlips: true,
        showOpenBets: false,
        // ************************************************************
            // override children relay variables
            isAuthenticated: false,
            openBetsRefreshTimes: 0,
            serverSideReceiptNumber: null,
        // ************************************************************
    },
    prepareVariables: (preVars) => {
        const newVars = {
            ...preVars,
            showBetSlips: !preVars.showOpenBets,
            openBetsRefreshTimes: preVars.showOpenBets ? getArbitraryParamValue() : preVars.openBetsRefreshTimes,
        };
        // console.log(`********* FKBetSlipTeamplte.setVariables with ${JSON.stringify(newVars)} *****************`);
        return newVars;
    },
    fragments: {
        viewer: (variables) => Relay.QL`
            fragment on Viewer {
                ${BetSlipCardsHolder.getFragment('viewer').if(variables.showBetSlips)}
                ${OpenBetCardsHolder.getFragment('viewer', variables).if(variables.showOpenBets)}
                ${BetReceiptsHolder.getFragment('viewer', variables)}
            }
        `,
    },
});
```

  ```javascript
    shouldComponentUpdate(
      nextProps: Object,
      nextState: any,
      nextContext: any,
    ): boolean {

    // a relay container only get re-renders in 3 scenarios
    return ( /* #1 it's normal props changes !! 
            this is why you need <SearchContainer relay={props.relay}/> */
            !RelayContainerComparators.areNonQueryPropsEqual(
              fragments,
              this.props,
              nextProps,
            ) || /* #2 query returns */
            (fragmentPointers &&
              !RelayContainerComparators.areQueryResultsEqual(
                fragmentPointers,
                this.state.queryData, 
                nextState.queryData,
              )) || /*#3 variables changed . never happened ? a bug?*/
            !RelayContainerComparators.areQueryVariablesEqual(
              this.state.relayProp.variables,
              nextState.relayProp.variables,
            )
          );
}
```