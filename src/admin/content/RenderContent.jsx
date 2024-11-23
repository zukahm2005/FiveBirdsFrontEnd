import React from "react";
import ListUser from "./userAdmin/listUser/ListUser";
import UserList from "./userAdmin/UserAdmin";
import ProductAdmin from "./productAdmin/ProductAdmin";
import FooterEditAdmin from "../components/footereditAdmin/FooterEditAdmin";
const RenderContent = ({ selectedOption }) => {
  switch (selectedOption) {
    case "UserList":
      return <UserList />;
    case "ListUser":
      return <ListUser />;
    case "ProductAdmin":
      return <ProductAdmin />;
      case "FooterEditAdmin":
        return <FooterEditAdmin />;
    default:
      return <div>Select an option from the menu</div>;
  }
};

export default RenderContent;
