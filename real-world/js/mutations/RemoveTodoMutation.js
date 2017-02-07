import Relay from 'react-relay';

export default class RemoveTodoMutation extends Relay.Mutation {
  //Mutation's fragment builder; all the properies defined within spec will be availble as __fragment__ from 
  //mustation's props
  static fragments = {
    // TODO: Mark complete as optional
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
      }
    `,
    // TODO: Mark completedCount and totalCount as optional
    viewer: () => Relay.QL`
      fragment on User {
        completedCount,
        id,
        totalCount,
      }
    `,
  };
  //get server mutation defination
  getMutation() {
    return Relay.QL`mutation{removeTodo}`;
  }
  //to be intersected with tracked queries (per node)
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveTodoPayload @relay(pattern: true) {
        deletedTodoId,
        viewer {
          completedCount,
          totalCount,
        },
      }
    `;
  }

  //what do you do once mutation returns?
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      deletedIDFieldName: 'deletedTodoId',
    }];
  }
  //prepare data for server mutation inputFields
  getVariables() {
    return {
      id: this.props.todo.id,
    };
  }

  //you must returns **exactly** the same format as server does
  getOptimisticResponse() {
    const viewerPayload = {id: this.props.viewer.id};
    if (this.props.viewer.completedCount != null) {
      viewerPayload.completedCount = this.props.todo.complete === true ?
        this.props.viewer.completedCount - 1 :
        this.props.viewer.completedCount;
    }
    if (this.props.viewer.totalCount != null) {
      viewerPayload.totalCount = this.props.viewer.totalCount - 1;
    }
    return {
      deletedTodoId: this.props.todo.id,
      viewer: viewerPayload,
    };
  }
}
