import React, { Fragment } from "react";
import { connect } from "react-redux";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import "./materialTree.css";

import { districtTreeConverter } from "../../../../util/districtTreeConverter";

const District = props => {
  const { fields, customer } = props;
  const treeData = districtTreeConverter(customer.uf_location.value, fields);

  const onChange = (currentNode, selectedNodes) => {
    console.log("path::", currentNode.path);
  };

  const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach(k => {
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  };

  if (treeData) assignObjectPaths(treeData);

  return { treeData } ? (
    <DropdownTreeSelect
      data={treeData}
      onChange={onChange}
      className="mdl-demo"
      placeholderText="Выбор района"
    />
  ) : (
    <span />
  );
};
const mapStateToProps = (state, ownProps) => {
  const { fields, current, values } = state.crm.leads;
  return { fields, customer: values[current] };
};

export default connect(mapStateToProps, null)(District);
