import React, { Component } from "react";
import CURDComponent from "../../templates/CURD.component";
import { BanData, NewBanData } from "../../interface/routes/Ban.interface";
import { FormRelation } from "../../interface/Form.interface";
import { LookupbarResult } from "../../interface/Lookupbar.interface";
import { ban } from "./TestUnit";
import FormField from "../../components/FormField";

export class Archive extends CURDComponent<BanData, NewBanData> {
  public name = "Ban";
  public cQuestions: FormRelation<NewBanData> = {
    customerID: new FormField({
      question: { label: "Customer", input: "text" }
    }),
    reason: new FormField({ question: { label: "Reason", input: "textarea" } })
  };
  public sQuestions: FormRelation<Omit<BanData, keyof NewBanData>> = {
    id: new FormField({ question: { label: "ID", input: "text" } })
  };
  public delete = async (id: string) => {};
  public update = async (value: NewBanData) => {};
  public fetch = async (id: string): Promise<BanData> => {
    return ban;
  };
  public query = async (value: string): Promise<BanData[]> => {
    return [];
  };
  public new = async (value: NewBanData) => {};
  public toResult = (value: BanData): LookupbarResult => {
    return {
      title: "Customer ID: " + value.customerID,
      id: value.id,
      description: "Reason: " + value.reason
    };
  };
}

export default Archive;
