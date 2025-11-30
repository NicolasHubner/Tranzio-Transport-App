import { Area } from "./Area";
import { CompanyAirLine } from "./CompanyAirLine";
import { Department } from "./Department";
import { Module } from "./Module";
import { Shift } from "./Shift";

export interface Company {
    id: string;
    name: string;
    cnpj: string;
    areas: Area;
    company_airlines: CompanyAirLine;
    shifts: Shift;
    departments: Department;
    modules: Module;
}