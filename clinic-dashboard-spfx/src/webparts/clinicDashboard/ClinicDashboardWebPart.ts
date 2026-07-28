import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import { ClinicDashboard } from "./components/ClinicDashboard";

export interface IClinicDashboardWebPartProps {
  title: string;
}

export default class ClinicDashboardWebPart extends BaseClientSideWebPart<IClinicDashboardWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(ClinicDashboard, {
      context: this.context,
    });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Clinic Dashboard Patient Portal settings" },
          groups: [
            {
              groupName: "Settings",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Web part title (informational only; not shown in-app)",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
