import React from "react";
import { Spin } from "antd";

const SpinWrapper = ({ loading, tip = "Loading...", children }) => {
  return (
    <Spin spinning={loading} tip={tip}>
      {children}
    </Spin>
  );
};

export default SpinWrapper;
