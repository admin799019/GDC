import * as React from 'react';
import styles from './GdcDevOpsAutomation.module.scss';
import CustomStyles from './GdcDevOpsAutomation.module.scss';
import { TextField, ITextFieldProps } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, IDropdownProps } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { DatePicker } from '@fluentui/react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import * as _ from 'lodash';
//import Logo from './../GDCLogo.jsx';
import { Label } from '@fluentui/react/lib/Label';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { IStackTokens, Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { classNamesFunction, IRenderFunction } from '@fluentui/react/lib/Utilities';
import { ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType, IPanelProps } from '@fluentui/react/lib/Panel';
import { Link } from '@fluentui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import "./GdcDevOpsAutomationCustom.css";

import { IDevOpsService } from '../../../Services/IDevOpsService';
import { ISPService } from '../../../Services/ISPService';

import { metaData } from '../../../JSONFormMetadata/Metadata';

import CustomPeoplePicker from "./CustomPeoplePicker";
import { elementContains } from 'office-ui-fabric-react';

interface MetaDataType {
  field: string;
  fieldType: string;
  label: string;
  placeholder: string;
  className: string;
  helperText: string;
  options: any;
  value: string;
  required: boolean;
  checked: boolean;
  errorMessage: string;
  devopsName: string;
  showError: boolean;
  subFields: Array<subFieldsObjectType>;
  cascadingField: string;
  files:any;
}

interface subFieldsObjectType {
  option: string;
  fields: Array<MetaDataType>;
  active: boolean;
}

const Area = {
  "field": "Analytics Area",
  "fieldType": "SingleSelectInput",
  "label": "GDC Data & Analytics Area",
  "placeholder": "",
  "className": "fields",
  "helperText": "",
  "options": [
    { "key": "Data Services", "text": "Data Services" },
    { "key": "Channel Analytics", "text": "Channel Analytics" },
    { "key": "Marketing Engagement & Innovation", "text": "Marketing Engagement & Innovation" },
    { "key": "Targeting Enablement & Business Health", "text": "Targeting Enablement & Business Health" }
  ],
  "value": ""
};
const iconStyle=
  { cursor: 'pointer' }
  

const stackTokens: IStackTokens = {
  childrenGap: 2,
  maxWidth: 300,
};

const onWrapDefaultLabelRenderer = (
  props: any,
  defaultRender: IRenderFunction<any>,
): JSX.Element => {
  return (
    <>
      <Stack horizontal verticalAlign="center" tokens={stackTokens}>
        <span>{defaultRender(props)}</span>
        <Icon iconName="Info" 
       style={iconStyle}
        title={props.name} 
      
       
        className="tooltip"  ariaLabel="value required" />
      </Stack>
    </>
  );
};

export interface IDevOpsProps {
  devOpsService: IDevOpsService;
  spService: ISPService;
  context: any;
}

export interface IDevOpsState {
  projects: [];
  text: any;
  formData: any;
  formFields: MetaDataType[];
  formSuccessMessage: string;
  showMessage: boolean;
  showAddButton: boolean;
  multiSelectedKeys: string[];
  files: [];
  openPanel: boolean;
  selectedButton: string;
  disableSubmitButton: boolean;
  showErrorMessage: boolean;
  panelHasScroll: boolean;

}

const iconStyles = { marginRight: '8px' };
export default class GdcDevOpsAutomation extends React.Component<IDevOpsProps, IDevOpsState> {
  public requiredHasValues: boolean = true;
  public DescriptionData = "";
  public AttachmentAPI: any = [];
  public panelRef;
  public richTextFieldCalls: number = 0;
  public constructor(props) {
    super(props);
    this.panelRef = React.createRef();

    this.state = {
      projects: [],
      text: "",
      // DescriptionData: "",
      formData: [],
      formFields: metaData,
      formSuccessMessage: "",
      showMessage: false,
      showAddButton: false,
      multiSelectedKeys: [],
      files: [],
      openPanel: false,
      selectedButton: "",
      disableSubmitButton: false,
      showErrorMessage: false,
      panelHasScroll: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
    this.UpdateRichText = this.UpdateRichText.bind(this);
    this.UpdateRichTextFields = this.UpdateRichTextFields.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.updateFormFields = this.updateFormFields.bind(this);
    this.appendValues = this.appendValues.bind(this);
    this.appendAPI = this.appendAPI.bind(this);
    this.getCascadingFieldValue = this.getCascadingFieldValue.bind(this);
    this.onRenderNavigationContent = this.onRenderNavigationContent.bind(this);
    this.onRenderPlaceholder = this.onRenderPlaceholder.bind(this);
    this.onRenderOption = this.onRenderOption.bind(this);
    this.addUserStory = this.addUserStory.bind(this);
  }

  public componentDidMount() {
    var projects: [];
    this.setState({
      projects: projects
    });
  }

  public handleChange(value: any, name) {
    var stateValues = _.cloneDeep(this.state.formFields);
    stateValues = this.appendValues(stateValues, value, name);
    this.setState({
      formFields: stateValues,
    });
  }

  public appendValues(stateValues, value: any, name) {
    var subFieldsObject;
    var i = 0;
    stateValues.map((field: MetaDataType, index) => {
     

      if (field.field == name) {
        i = index;
        if ((value == "" || value == " " || value == "<p><br></p>") && field.required == true) 
        {
          field.showError = true;
        }
        else if (value != "" || value != "<p><br></p>") {
          field.showError = false;
        }

        if (field.fieldType == "SingleLineTextInput" && value == " ") {
          field.value = "";
        }

        if (field.fieldType == "SingleLineTextInput" && value.length >= 255) {
          field.value = field.value;
        }

        if (field.fieldType == "SwitchInput") {
          field.checked = value == true ? true : false;
          field.value = value;
        }

        // if (field.fieldType == "MultiLineTextInput") {
        //   var ele = document.createElement('div');
        //   ele.innerHTML = value;
        //   console.log("multi", ele.innerText);
        // }
        if (field.fieldType == "FileInput") {
          console.log("inside append values",field)
           field.files=value;
        }
       
        // else if (field.fieldType == "MultiLineTextInput") {
        //   var regex = /(<([^>]+)>)/ig;
        //   let hasText = !!value.replace(regex, "").trim().length;
        //   let element = document.createElement('div');
        //   element.innerHTML = value;
        //   let imgsLenth = element.querySelectorAll('img').length;
        //   if (!hasText) {
        //     if (imgsLenth > 0) {
        //       hasText = true;
        //     }
        //   }
        //   if (hasText) {
        //     field.showError = false;
        //     this.requiredHasValues = true;
        //   }
        //   else {
        //     field.showError = true;
        //     this.requiredHasValues = false;
        //   }
        // }
        else {
          field.value = value;
        }

        if (field.subFields != null && field.subFields.length > 0) {
          field.subFields.map(sfoption => {
            sfoption.option == value ? sfoption.active = true : sfoption.active = false;
          });
        }
      }
      else if (field.field != name && field.subFields != null && field.subFields.length > 0) {
        subFieldsObject = field.subFields.filter(f => f.active == true);
        if (subFieldsObject.length > 0) {
          subFieldsObject[0].fields = this.appendValues(subFieldsObject[0].fields, value, name);
        }
      }
     
    });
    return stateValues;
  }

  public handleToggleChange(value: any, name) {
    var stateValues = this.state.formFields;
    stateValues.map((f) => {
      if (f.field == name) {
        f.checked = value;
        f.value = value;
      }
    });
    this.setState({
      formFields: stateValues
    });
  }

  public async UpdateRichTextFields(): Promise<any> {
    var fields = _.cloneDeep(this.state.formFields);

    fields.map(async (f) => {
      if (f.fieldType == "MultiLineTextInput") {
        this.richTextFieldCalls = this.richTextFieldCalls + 1;
        await this.UpdateRichText(f.value).then(mlt => {
          f.value = mlt;
          this.richTextFieldCalls = this.richTextFieldCalls - 1;
          if (this.richTextFieldCalls == 0) {
            console.log("updated state", fields);
            this.setState({
              formFields: fields
            });
            this.addUserStory();
          }
        });
      }
      if (f.subFields != null && f.subFields.length > 0) {
        if (f.subFields.filter(sfo => sfo.active == true).length > 0) {
          f.subFields.filter(sfo => sfo.active == true)[0].fields.map(async (sf) => {
            if (sf.fieldType == "MultiLineTextInput") {
              this.richTextFieldCalls = this.richTextFieldCalls + 1;
              await this.UpdateRichText(sf.value).then(smlt => {
                sf.value = smlt;
                this.richTextFieldCalls = this.richTextFieldCalls - 1;

                if (this.richTextFieldCalls == 0) {
                  console.log("updated state", fields);
                  this.setState({
                    formFields: fields
                  });
                  this.addUserStory();
                }
              });
            }
          });
        }
      }
    });

    if (this.richTextFieldCalls == 0) {
      console.log("updated state", fields);
      this.setState({
        formFields: fields
      });
      this.addUserStory();
    }
  }

  public async UpdateRichText(data): Promise<any> {
    let element = document.createElement('div');
    element.innerHTML = data;
    let imgsLenth = element.querySelectorAll('img').length;
    var imageCalls = [];
    element.querySelectorAll('img').forEach((ele) => {
      if (ele.src.indexOf('base64,') != 0) {
        let base64 = ele.src.substring(ele.src.indexOf('base64,') + 7);

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        imageCalls.push(this.props.devOpsService.uploadImage(blob, "image.png"));
      }
    });
    return Promise.all(imageCalls).then((d) => {
      element.querySelectorAll('img').forEach((ele, i) => {
        ele.src = d[i];
      });
      console.log("element - ", element);
      // this.props.devOpsService.updatefeature(element.innerHTML);
      return element.innerHTML;
    });
  }

  public  addUserStory() {
    var APIData = _.cloneDeep(this.state.formData);
    var parentFieldsRequiredHasValues: boolean = true;
    var teamDetails: any;

    if (this.state.formFields.filter(fv => fv.required == true && (fv.value == "" || fv.value == "<p><br></p>")).length > 0) {
      var stateCopy = [...this.state.formFields];
      stateCopy.map(scv => {
        if (scv.required == true && (scv.value == "" || scv.value == "<p><br></p>")) {
          scv.showError = true;
          parentFieldsRequiredHasValues = false;
        }
      });
    }

    this.appendAPI(this.state.formFields, APIData).then(async dataReturned => {
      if (this.requiredHasValues && parentFieldsRequiredHasValues) {
        APIData = dataReturned.APIData;
        if (APIData.filter(d => d.path == "/fields/System.AreaPath").length == 0) {
          APIData.push(
            {
            "op": "add",
            "path": "/fields/System.AreaPath",
            "from": null,
            "value": `Operational Framework Test\\` + Area.value
          });
        }
        else {
          let pathPrefix = "Operational Framework Test\\Channel Analytics\\";
          APIData.filter(d => d.path == "/fields/System.AreaPath")[0].value = (pathPrefix.concat(APIData.filter(d => d.path == "/fields/System.AreaPath")[0].value));
          console.log(APIData.filter(d => d.path == "/fields/System.AreaPath")[0].value, "hello from areapath");
        }
        //addorupdate == "add" ? this.props.devOpsService.addfeature(APIData) : this.props.devOpsService.updatefeature(APIData);
        APIData.push({
          "op": "add",
          "path": "/fields/System.Description",
          "from": null,
          "value": this.DescriptionData
        });
        console.log(this.AttachmentAPI,"attachfiles datta")
         APIData = [...APIData,...this.AttachmentAPI];
    
       //console.log("hellofrom loop");
    //  APIData=APIData.concat(this.AttachmentAPI[0]);
     
        console.log(APIData,"apidata final")
        this.props.devOpsService.addfeature(APIData).then((data) => {
          if (data.id != null) {
            this.setState({
              formFields: metaData,
              formSuccessMessage: "New User Story has been created successfully with ID " + data.id,
              showMessage: true,
              showAddButton: false,
              openPanel: false,
              disableSubmitButton: false,
              showErrorMessage: false,
              panelHasScroll: false,
              selectedButton: ""
            });
            setTimeout(function () {
              this.setState({ showMessage: false });
            }.bind(this), 5000);
            this.props.devOpsService.getTeamDetails(Area.value).then(emailData => {
              let emails: any = [];
              emailData.value.forEach(element => {
                emails.push(element.identity.uniqueName);
              });
              this.props.spService.sendEmail(Area.value, emails, data.id);
            });
            Area.value = "";
          }
          else {
            this.setState({
              formFields: metaData,
              formSuccessMessage: "Error occured while processing your request. Please try again.",
              showMessage: true,
              showAddButton: false,
              openPanel: false,
              disableSubmitButton: false,
              showErrorMessage: false,
              panelHasScroll: false,
              selectedButton: ""
            });
            setTimeout(function () {
              this.setState({ showMessage: false });
            }.bind(this), 5000);
            Area.value = "";
          }

        });
      }
      else {
        stateCopy = dataReturned.Fields;
        this.setState({
          formFields: stateCopy,
          disableSubmitButton: false,
          showErrorMessage: true
        });
      }
    });
  }

  public async submitForm(addorupdate: string) {
    this.DescriptionData = "";
    this.AttachFiles();
  }

  public onMultiSelectChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    if (item) {
      var x: any = this.state.multiSelectedKeys;
      x.push(item.key);
      this.setState({
        multiSelectedKeys:
          item.selected ? x : this.state.multiSelectedKeys.filter(key => key !== item.key),
      });
    }
    this.handleChange(this.state.multiSelectedKeys, "RequestedPriority");
  }

  public async appendAPI(Fields: MetaDataType[], APIData) {
    var requiredHasValues: boolean = true;
    var subFields;
    var mlt = [];

    for (let field of Fields) {
      if (field.devopsName == "System.Description") {
        var tempDesc = "";
        tempDesc = tempDesc.concat("<div><b>", field.field, "</b></div><div>", field.value, "</div></br>");
        this.DescriptionData = this.DescriptionData.concat(tempDesc);
      }
      if (field.devopsName != "System.Description" && field.devopsName != "Attachments") {
        APIData.push({
          "op": "add",
          "path": "/fields/" + field.devopsName,
          "from": null,
          "value": field.value
        });
      }
      if (field.devopsName == "Attachments") {

      }
      if (field.subFields != null && field.subFields.length > 0 && field.subFields.filter(f => f.option == field.value).length > 0) {
        subFields = field.subFields.filter(f => f.option == field.value)[0].fields;

        if (subFields.filter(fv => fv.required == true && (fv.value == "" || fv.value == "<p><br></p>")).length > 0) {
          var stateCopy = [...subFields];
          stateCopy.map(scv => {
            if (scv.required == true && (scv.value == "" || scv.value == "<p><br></p>")) {
              scv.showError = true;
              this.requiredHasValues = false;
            }
          });
          // return { "APIData": APIData, "Fields": Fields, "requiredHasValues": requiredHasValues };
        }
        this.appendAPI(subFields, APIData).then(data => {
          return { "APIData": APIData, "Fields": Fields, "requiredHasValues": requiredHasValues };
        });
      }
    }
    return { "APIData": APIData, "Fields": Fields, "requiredHasValues": requiredHasValues };
  }

  public updateFormFields(option) {
    Area.value = option;
    this.props.spService.getFormMetadata(option).then((data) => {
      if (data != null) {
        var jsonData = JSON.parse(data.JSON);
        this.setState({
          formFields: jsonData,
          showMessage: false,
          showAddButton: true,
          selectedButton: option,
          panelHasScroll: true,
          showErrorMessage: false,
        });
      }
      else {
        this.setState({
          formFields: metaData,
          showMessage: false,
          showAddButton: false,
          selectedButton: option,
          panelHasScroll: true,
          showErrorMessage: false
        });
      }
    });
  }

  public onFileUpload(e,name) {
    e.preventDefault();
    var files: any = [];
    for (let f = 0; f < e.target.files.length; f++) {
      files.push(e.target.files[f]);
    }
    var stateValues = _.cloneDeep(this.state.formFields);
    stateValues = this.appendValues(stateValues, files,name);
    console.log(stateValues,"in fileupload");
    this.setState({
      formFields: stateValues
    });
  }

  public async AttachFiles(): Promise<any> {
    let count: number = 0;
    var FileUploadCalls = [];
    var richTextCallSent: boolean = false;
   
    this.state.formFields.map(async (field: MetaDataType, index) => {
      
      if(field.fieldType=="FileInput"){
      field.files.forEach((file: any) => {
      // let file = files[f];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (data: any) => {
        let base64 = data.target.result.toString().substring(data.target.result.toString().indexOf('base64,') + 7);
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        // FileUploadCalls.push(this.props.devOpsService.uploadImage(blob, file.name));
        count = count + 1;
        this.props.devOpsService.uploadImage(blob, file.name).then(d => {
          FileUploadCalls.push(d);
          this.AttachmentAPI.push(
            {
            "op": "add",
            "path": "/relations/-",
            "value": {
              "rel": "AttachedFile",
              "url": d,
              "attributes": {
                "comment": ""
              }
            }
          }
          );
          count = count - 1;
          if (count == 0 && !richTextCallSent) {
            console.log("files - ", this.AttachmentAPI);
            this.UpdateRichTextFields();
            richTextCallSent = true;
          }
        });
      };
    });
  }
  if (field.subFields != null && field.subFields.length > 0) {
    if (field.subFields.filter(sfo => sfo.active == true).length > 0) {
      field.subFields.filter(sfo => sfo.active == true)[0].fields.map(async (sf) => {
        if(sf.fieldType=="FileInput"){
         
          sf.files.forEach((file: any) => {
            // let file = files[f];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (data: any) => {
              let base64 = data.target.result.toString().substring(data.target.result.toString().indexOf('base64,') + 7);
              const byteCharacters = atob(base64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray]);
              // FileUploadCalls.push(this.props.devOpsService.uploadImage(blob, file.name));
              count = count + 1;
              this.props.devOpsService.uploadImage(blob, file.name).then(d => {
               
                console.log(d,"url");
                FileUploadCalls.push(d);
                this.AttachmentAPI.push(
                  {
                  "op": "add",
                  "path": "/relations/-",
                  "value": {
                    "rel": "AttachedFile",
                    "url": d,
                    "attributes": {
                      "comment": ""
                    }
                  }
                });
                
                count = count - 1;
              
                if (count == 0 && !richTextCallSent) {
                  console.log("files - ", this.AttachmentAPI);
                  this.UpdateRichTextFields();
                  richTextCallSent = true;
                }
              });
            };
          });
        }
      });
    }
  }



    if (count == 0 && !richTextCallSent && this.state.files.length == 0) {
      console.log("files - ", this.AttachmentAPI);
      await this.UpdateRichTextFields();
      richTextCallSent = true;

    }
  });
}

  public getCascadingFieldValue(fieldName) {
    var value = "";
    this.state.formFields.map(f => {
      if (f.field == fieldName) {
        value = f.value;
      }
      else if (f.subFields != null && f.subFields.length > 0) {
        if (f.subFields.filter(sfo => sfo.active == true).length > 0) {
          f.subFields.filter(sfo => sfo.active == true)[0].fields.map(sf => {
            if (sf.field == fieldName) {
              value = sf.value;
            }
          });
        }
      }
    });
    return value;
  }

  public onRenderNavigationContent(props, defaultRender) {
    return (
      <div className={this.state.panelHasScroll ? "gdcScrollPanelHeader" : "gdcPanelHeader"}>
        {/* <Logo /> */}
        {/* <div id="gdclogoId"></div> */}
        {/* <img src="https://m365x799019.sharepoint.com/:u:/s/GEPAnalyticsTest/ETT3OS8K81lHitMeA61_ElQBmlAHsdliUFoh5W5gnz7eZg?e=YrzMLQ" alt="My Happy SVG" /> */}
        <div className={this.state.panelHasScroll ? "gdcScrollPanelHeaderText" : "gdcPanelHeaderText"}> GDC Intake Form </div>
        <div className={this.state.panelHasScroll ? "gdcScrollPanelHeaderEllipses1" : "gdcPanelHeaderEllipses1"}></div>
        <div className={this.state.panelHasScroll ? "gdcScrollPanelHeaderEllipses2" : "gdcPanelHeaderEllipses2"}></div>

        <div className={this.state.panelHasScroll ? "gdcPanelCloseButton" : "gdcScrollPanelCloseButton"}>
          <Link onClick={(e) => { this.setState({ panelHasScroll: false, openPanel: false, formFields: metaData, showAddButton: false, showErrorMessage: false, selectedButton: "" }); }} underline={false}  >
            <Icon iconName="Cancel" style={iconStyle} className="gdcCloseIcon" /> Close
          </Link>
        </div>
      </div>
    );
  }

  private onRenderOption(option: any): JSX.Element {
    return (
      <div>
        {(
          <Icon style={{ marginRight: '8px', color: option.color }} iconName={"CircleFill"} aria-hidden="true" title={option.color} />
        )}
        <span>{option.text}</span>
      </div>
    );
  }

  private onRenderTitle(options: any[]): JSX.Element {
    const option = options[0];
    return (
      <div>
        {(
          <Icon style={{ marginRight: '8px', color: option.color }} iconName={"CircleFill"} aria-hidden="true" title={option.color} />
        )}
        <span>{option.text}</span>
      </div>
    );
  }

  public onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
    return (
      <div className="dropdownExample-placeholder">
        {/* <Icon style={iconStyles} iconName={'MessageFill'} aria-hidden="true" />  */}
        <span>{props.placeholder}</span>
      </div>
    );
  }

  public render(): JSX.Element {
    return (
      <div className="gdcBorder ">
        <div className="gdcMessage">
          {this.state.showMessage
            ?
            <MessageBar
              messageBarType={MessageBarType.success}
              isMultiline={false}
            >
              {this.state.formSuccessMessage}
            </MessageBar>
            : <div></div>
          }
        </div>
        <div>
          <Link onClick={(e) => { this.setState({ openPanel: true }); }} className="gdcNewButton" underline>
            New Intake Form
          </Link>
        </div>
        <Panel
          headerText="GDC Intake Form"
          isOpen={this.state.openPanel}
          type={PanelType.extraLarge}
          componentRef={this.panelRef}
          onRenderHeader={this.onRenderNavigationContent}
          hasCloseButton={false}
          className="gdcPanel"
        >
          <div className="gdcGrid"  >
            <div className="gdcGridRow gdcPaddingBottom15">
              <div className="gdcGridCol gdcGridCol12 questionHeader">
                <p className="questionTop">What team is your request for?</p>
                {
                  Area.options.map(area => {
                    return (<DefaultButton
                      text={area.text}
                      className={this.state.selectedButton == area.text ? "selectedButton" : "headerButton"}
                      onClick={e => this.updateFormFields(area.text)
                      }
                    />);
                  })
                }
              </div>
            </div>
            <div className="gdcGridRow">
              {
                this.state.formFields.map((ele) => {
                  return this.renderFields(ele);
                })
              }
              {this.state.showErrorMessage
                ? <MessageBar
                  className="requireMessage"
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                >Please complete the required fields.
                <Icon iconName="ErrorBadge" title="closebutton" style={iconStyle} className="errorclosebutton" onClick={(e)=>{
                  this.setState({showErrorMessage:false})
                }} />
                            </MessageBar>
                : <div></div>}
              <div className={this.state.showAddButton ? "gdcGridCol gdcGridCol12 " : "gdcGridCol gdcGridCol12 gdcDisplayNone "}>
                <PrimaryButton text="Submit" disabled={this.state.disableSubmitButton} className="gdcAddButton"
                  onClick={(e) => {
                    this.setState({ disableSubmitButton: true, showErrorMessage: false });
                    this.requiredHasValues = true; this.submitForm("add");
                  }} />
                {/* <PrimaryButton text="Update" onClick={() => this.submitForm("update")} /> */}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  public renderFields(ele: MetaDataType) {
    switch (ele.fieldType) {
      case "SingleLineTextInput":
        return (
          <React.Fragment>
            <div className={ele.className}>
              <TextField label={ele.label}
                autoComplete="off"
                onChange={(e, value) => this.handleChange(value, ele.field)}
                {...ele.showError == true ?{className:"gdcTextField requiredreddrop"}:{className:"gdcTextField"}}
                //className="gdcTextField"
                placeholder={ele.placeholder}
                value={ele.value} name={ele.helperText} required={ele.required} onRenderLabel={onWrapDefaultLabelRenderer} />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
            {(ele.subFields != null) && (ele.subFields.length > 0) && (ele.subFields.filter(fi => fi.option == ele.value).length > 0)
              ? ele.subFields.filter(fi => fi.option == ele.value)[0].fields.map(se => this.renderFields(se))
              : null
            }
          </React.Fragment>
        );
      case "SingleSelectInput":
        return (
          <React.Fragment>
            <div className={ele.className}>
              <Dropdown
                placeholder={ele.placeholder}
                label={ele.label}
                className="gdcDropDown"
                onRenderLabel={onWrapDefaultLabelRenderer}
                {...ele.showError == true ?{className:"gdcDropDown requiredreddrop"}:{className:"gdcDropDown"}}
                defaultSelectedKey={ele.options.filter(e => e.key == ele.value).length > 0 ? ele.options.filter(e => e.key == ele.value)[0].key : -1}

                options={ele.options}
                {...ele.options[0].color != null || ele.options[0].color != undefined ?
                  {
                    onRenderOption: this.onRenderOption,
                    onRenderTitle: this.onRenderTitle,
                    onRenderPlaceholder: this.onRenderPlaceholder
                  } : {}}
                onChange={(e, o) => this.handleChange(o.key, ele.field)}
                required={ele.required}
              />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
            {(ele.subFields != null) && (ele.subFields.length > 0) && (ele.subFields.filter(fi => fi.option == ele.value).length > 0)
              ? ele.subFields.filter(fi => fi.option == ele.value)[0].fields.map(se => this.renderFields(se))
              : null
            }
          </React.Fragment>
        );
      case "SingleSelectCascadingInput":
        var cascadingField = ele.cascadingField;
        var cascadingFieldValue = this.getCascadingFieldValue(cascadingField);
        var options = cascadingFieldValue != ""
          ? ele.options.filter(opt => opt.cascadingOption == cascadingFieldValue)
          : [];
        return (
          <React.Fragment>
            <div className={ele.className}>
              <Dropdown
                placeholder={ele.placeholder}
                label={ele.label}
                options={options}
                {...ele.showError == true ?{className:"gdcDropDown requiredreddrop"}:{className:"gdcDropDown"}}
                //className="gdcDropDown"
                onChange={(e, o) => this.handleChange(o.key, ele.field)}
                required={ele.required}
              //styles={dropdownStyles}
              />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
          </React.Fragment>
        );
      case "RadioButtonInput":
        return (
          <React.Fragment>
            <div className={ele.className}>
              <ChoiceGroup options={ele.options}
                   {...ele.showError == true ?{className:"gdcRadioButton requiredred"}:{className:"gdcRadioButton"}}
               // className="gdcRadioButton"
                onChange={(e, o) => this.handleChange(o.key, ele.field)}
                label={ele.label} required={ele.required} />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
            {(ele.subFields != null) && (ele.subFields.length > 0) && (ele.subFields.filter(fi => fi.option == ele.value).length > 0)
              ? ele.subFields.filter(fi => fi.option == ele.value)[0].fields.map(se => this.renderFields(se))
              : null
            }
          </React.Fragment>
        );
      case "DateInput":
        return (
          <div className={ele.className + " gdcDateInput"}>
            <Label>{ele.label} {ele.required ? <span className="gdcStar">*</span> : ""}</Label>
            <Icon iconName="Info" title={ele.helperText} style={iconStyle} className="tooltip" ariaLabel="value required" />
            <DatePicker
              allowTextInput
              isMonthPickerVisible={false} showMonthPickerAsOverlay={true}
              placeholder={ele.placeholder}
              ariaLabel="Select a date" 
              {...ele.showError == true ?{className:"requiredreddrop"}:{className:""}}
              onSelectDate={(e) => this.handleChange(e.toLocaleDateString(), ele.field)}
            />
            {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
          </div>
        );
      case "SwitchInput":
        return (
          <React.Fragment>
            <div className={ele.className}>
              <Toggle
                {...ele.checked ? { className: "gdcSwitchInput black" } : { className: "gdcSwitchInput" }}
                //className="gdcSwitchInput"
                label={ele.label} onText={ele.options.onText} offText={ele.options.offText}
                onChange={(e, c) => this.handleChange(c, ele.field)}
                checked={ele.checked}

              />
            </div>

            {(ele.subFields != null) && (ele.subFields.length > 0) && (ele.subFields.filter(fi => fi.option == ele.value).length > 0)
              ? ele.subFields.filter(fi => fi.option == ele.value)[0].fields.map(se => this.renderFields(se))
              : null
            }
          </React.Fragment>
        );
      case "MultiLineTextInput":
        return (
          <div className="">
            <div className={ele.className + " gdcColumnBlock"}>
              <Label>{ele.label + " "} {ele.required ? <span className="gdcStar">* </span> : ""}
                {ele.helperText ?
                  {
                    ...  <Icon iconName="Info" className="tooltip" style={iconStyle} title={ele.helperText} ariaLabel="value required" />
                  } : ""}
              </Label>
              <ReactQuill
                defaultValue={ele.value}
                preserveWhitespace={true}
                {...ele.showError == true ?{className:"gdcMultiLine requiredred"}:{className:"gdcMultiLine"}}
                placeholder={ele.placeholder}
               // className="gdcMultiLine"
                 onChange={(data) => this.handleChange(data, ele.field)} />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
          </div >
        );
      case "PeoplePickerInput":
        return (
          <div className={ele.className}>
            {/* <PeoplePicker
            context={this.props.context}
            titleText="People Picker"
            personSelectionLimit={1}
            groupName={""} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            required={false}
            disabled={false}
            onChange={(items) => this.handleChange(items[0].secondaryText, ele.title)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} /> */}
            <div className="peoplepicker">
              <CustomPeoplePicker

                required={ele.required} spService={this.props.spService} pickerFieldName={ele.field} handlePeopleChange={this.handleChange} />
              {ele.showError == true ? <div className="gdcerror">{ele.errorMessage}</div> : <div></div>}
            </div>
          </div>
        );
      case "FileInput":
        return (
          <React.Fragment>
            <div className={ele.className + " filepicker"}>
              <p> {ele.placeholder}</p>
              <div className="fileInput" >
                <Label htmlFor="file-upload" className="custom-file-upload">

                  <Icon iconName="Attach" style={iconStyle} className="gdcAttachIcon" /> Add attachment
                </Label>
                <input type="file"
                  id="file-upload"
                  multiple
                  onChange={e => this.onFileUpload(e,ele.field)} />
              </div>
              <div className="attachmentNames">{
              ele.files.map((n:any) => {
                console.log(n.name,"attachments name loop");
                return (<label>{n.name}</label>);
              })}</div>
            </div>
          </React.Fragment>
        );
    }
  }
}
